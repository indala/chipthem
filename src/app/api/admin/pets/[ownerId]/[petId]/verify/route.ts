
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { verifyTokenAndGetPayload } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ ownerId: string; petId: string }> }
) {
  const payload = await verifyTokenAndGetPayload();
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { ownerId, petId } = await params;

  try {
    // 1️⃣ Check owner status
    const { data: ownerData, error: ownerFetchError } = await supabaseServerClient
      .from("owners")
      .select("id, is_verified")
      .eq("id", ownerId)
      .single();

    if (ownerFetchError || !ownerData) {
      console.error("❌ Owner fetch error:", ownerFetchError);
      return NextResponse.json(
        { success: false, message: "Owner not found." },
        { status: 404 }
      );
    }

    // 2️⃣ If not verified, verify the owner first
    if (!ownerData.is_verified) {
      const { error: ownerVerifyError } = await supabaseServerClient
        .from("owners")
        .update({
          is_verified: true,
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", ownerId);

      if (ownerVerifyError) {
        console.error("❌ Owner verification failed:", ownerVerifyError);
        return NextResponse.json(
          { success: false, message: "Failed to verify owner." },
          { status: 500 }
        );
      }
      console.log(`✅ Owner ${ownerId} verified.`);
    }

    // 3️⃣ Check if pet belongs to this owner
    const { data: petData, error: petFetchError } = await supabaseServerClient
      .from("pets")
      .select("id, owner_id, is_verified")
      .eq("id", petId)
      .single();

    if (petFetchError || !petData) {
      console.error("❌ Pet fetch error:", petFetchError);
      return NextResponse.json(
        { success: false, message: "Pet not found." },
        { status: 404 }
      );
    }

    if (petData.owner_id !== ownerId) {
      console.warn(`⚠️ Pet ${petId} does not belong to owner ${ownerId}`);
      return NextResponse.json(
        { success: false, message: "Pet does not belong to this owner." },
        { status: 400 }
      );
    }

    // 4️⃣ Verify the pet if not already verified
    if (!petData.is_verified) {
      const { error: petVerifyError } = await supabaseServerClient
        .from("pets")
        .update({
          is_verified: true,
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", petId);

      if (petVerifyError) {
        console.error("❌ Pet verification failed:", petVerifyError);
        return NextResponse.json(
          { success: false, message: "Failed to verify pet." },
          { status: 500 }
        );
      }

      console.log(`✅ Pet ${petId} verified for owner ${ownerId}`);
    } else {
      console.log(`ℹ️ Pet ${petId} already verified.`);
    }

    return NextResponse.json({
      success: true,
      message: `Owner (${ownerId}) and pet (${petId}) verified successfully.`,
    });
  } catch (err) {
    console.error("🔥 Verification route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
