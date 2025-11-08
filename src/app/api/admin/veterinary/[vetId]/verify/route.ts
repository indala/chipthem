
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { verifyTokenAndGetPayload } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ vetId: string }> }
) {
  const payload = await verifyTokenAndGetPayload();
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { vetId } = await params;

  try {
    // --- Update verification fields ---
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
