// app/api/pet/[petId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const { petId } = await params;

    if (!petId) {
      return NextResponse.json({ error: "Pet ID required" }, { status: 400 });
    }

    const data = await request.json();

    const { data: updatedPet, error: updateError } = await supabaseServerClient
      .from("pets")
      .update({
        // Only fields owner is allowed to edit:
        pet_name: data.pet_name,
        pet_type: data.pet_type,
        breed: data.breed,
        sex: data.sex,
        primary_color: data.primary_color,
        // Do NOT expose these to owner:
        // microchip_number
        // status
        // is_verified
        // verified_at
        // updated_at (can be handled via DB trigger)
      })
      .eq("id", petId)
      .select()
      .single();

    if (updateError || !updatedPet) {
      console.error("Pet update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update pet" },
        { status: 500 }
      );
    }

    return NextResponse.json({ pet: updatedPet });
  } catch (error) {
    console.error("Pet update API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
