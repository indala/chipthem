// /api/admin/users/route.ts
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

export async function GET() {
  try {
    // Fetch all pet owners
    const { data: petOwners, error: petError } = await supabaseServerClient
      .from("owners")
      .select("id, email, full_name, is_verified, verified_at");

    if (petError) throw petError;

    // Fetch all veterinary clinics
    const { data: veterinaries, error: vetError } = await supabaseServerClient
      .from("veterinary_clinics")
      .select("id, clinic_name, email, is_verified, verified_at");

    if (vetError) throw vetError;

    return NextResponse.json({
      success: true,
      petOwners,
      veterinaries,
    });
  } catch (err: unknown) {
    console.error("❌ Fetch users failed:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
