
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { verifyTokenAndGetPayload } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ vetId: string }> }
) {
  const payload = await verifyTokenAndGetPayload();
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { vetId } = await params;

  try {
    const { error: deleteError } = await supabaseServerClient
      .from("veterinary_clinics")
      .delete()
      .eq("id", vetId);

    if (deleteError) {
      console.error("Vet delete error:", deleteError);
      return NextResponse.json(
        { success: false, message: "Failed to reject veterinary clinic." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Veterinary clinic rejected and removed successfully.",
    });
  } catch (err) {
    console.error("Vet reject route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
