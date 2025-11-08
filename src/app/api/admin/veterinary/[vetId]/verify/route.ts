import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ vetId: string }> }
) {
  const { vetId } =await params;

  try {
    

    // --- 3. Update verification fields ---
    const { error: updateError } = await supabaseServerClient
      .from("veterinary_clinics")
      .update({
        is_verified: true,
        status: "verified",
        verified_at: new Date().toISOString(),
      })
      .eq("id", vetId);

    if (updateError) {
      console.error("Error verifying veterinary:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to verify veterinary clinic." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Veterinary clinic successfully verified.",
    });
  } catch (err) {
    console.error("Vet verify route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
