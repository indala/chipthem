import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

interface PetInfo {
  petName: string | null;
  petType: string | null;
  petColor: string | null;
  ownerName: string;
  phone?: string | null;
  email: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chipNumber = searchParams.get("chipNumber");

  // --- 1. Validate Input ---
  if (!chipNumber) {
    return NextResponse.json({ found: false, message: "Chip number is required." }, { status: 400 });
  }

  const sanitizedChipNumber = chipNumber.trim();
  if (sanitizedChipNumber.length !== 15 || !/^\d+$/.test(sanitizedChipNumber)) {
    return NextResponse.json({ found: false, message: "Invalid chip number format." }, { status: 400 });
  }

  try {
    // --- 2. Query Database ---
    const { data: pet, error } = await supabaseServerClient
      .from("pets")
      .select(`
        *,
        owner:owners(*)
      `)
      .eq("microchip_number", sanitizedChipNumber)
      .maybeSingle(); // single pet expected

    if (error) {
      console.error("Search API database error:", error);
      return NextResponse.json({ found: false, message: "Database query failed." }, { status: 500 });
    }

    // --- 3. Check pet & owner ---
    if (!pet || !pet.is_verified || !pet.owner) {
      return NextResponse.json({ found: false });
    }

    const ownerDetails = Array.isArray(pet.owner) ? pet.owner[0] : pet.owner;

    if (!ownerDetails) {
      return NextResponse.json({ found: false, message: "Owner not found for this pet." });
    }

    // --- 4. Format Response ---
    const result: PetInfo = {
      petName: pet.pet_name,
      petType: pet.pet_type,
      petColor: pet.primary_color,
      ownerName: ownerDetails.full_name,
      phone: ownerDetails.phone_number,
      email: ownerDetails.email,
    };

    return NextResponse.json({ found: true, result });

  } catch (err) {
    console.error("Search API route error:", err);
    return NextResponse.json({ found: false, message: "Internal server error." }, { status: 500 });
  }
}
