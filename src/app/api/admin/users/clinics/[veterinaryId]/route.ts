// /api/admin/users/clinics/[veterinaryId]/route.ts

import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
// import { verifyTokenAndGetPayload } from "@/lib/auth"; // REMOVED

// ⭐ PATCH: Update clinic details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ veterinaryId: string }> }
) {
  // const payload = await verifyTokenAndGetPayload(); // REMOVED
  // if (!payload || payload.role !== "admin") { // REMOVED
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // REMOVED
  // } // REMOVED

  const { veterinaryId } = await params;

  try {
    const updates = await req.json();

    // Fetch current clinic data
    const { data: clinic, error: fetchError } = await supabaseServerClient
      .from("veterinary_clinics")
      .select("*")
      .eq("id", veterinaryId)
      .single();

    if (fetchError || !clinic) {
      return NextResponse.json(
        { success: false, message: "Clinic not found." },
        { status: 404 }
      );
    }

    // ---- SUBSCRIPTION LOGIC ----
    const now = new Date();

    const subscribedAt = updates.subscribed_at
      ? new Date(updates.subscribed_at)
      : clinic.subscribed_at
      ? new Date(clinic.subscribed_at)
      : null;

    const subscriptionExpiresAt = updates.subscription_expires_at
      ? new Date(updates.subscription_expires_at)
      : clinic.subscription_expires_at
      ? new Date(clinic.subscription_expires_at)
      : null;

    let subscription_status = clinic.subscription_status || "none";

    if (subscriptionExpiresAt) {
      if (subscriptionExpiresAt < now) subscription_status = "expired";
      else subscription_status = "active";

      // Grace period logic (7 days)
      const gracePeriodDays = 7;
      const diffDays =
        (subscriptionExpiresAt.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffDays >= 0 && diffDays <= gracePeriodDays)
        subscription_status = "grace_period";
    }

    const finalUpdates = {
      ...updates,
      subscription_status,
      updated_at: new Date().toISOString(),
    };

    // Perform update
    const { data: updatedClinic, error: updateError } =
      await supabaseServerClient
        .from("veterinary_clinics")
        .update(finalUpdates)
        .eq("id", veterinaryId)
        .select()
        .single();

    if (updateError) {
      console.error("❌ Clinic update failed:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update clinic." },
        { status: 500 }
      );
    }

    // Build subscription timeline response
    const timeline =
      subscribedAt && subscriptionExpiresAt
        ? {
            subscribed_at: subscribedAt.toISOString(),
            subscription_expires_at: subscriptionExpiresAt.toISOString(),
            remaining_days: Math.ceil(
              (subscriptionExpiresAt.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            status: subscription_status,
          }
        : null;

    return NextResponse.json({
      success: true,
      message: "Clinic updated successfully.",
      clinic: updatedClinic,
      subscriptionTimeline: timeline,
    });
  } catch (err) {
    console.error("🔥 Clinic update route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// ⭐ DELETE: Remove clinic record
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ veterinaryId: string }> }
) {
  // const payload = await verifyTokenAndGetPayload(); // REMOVED
  // if (!payload || payload.role !== "admin") { // REMOVED
  //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // REMOVED
  // } // REMOVED

  const { veterinaryId } = await params;

  try {
    const { error } = await supabaseServerClient
      .from("veterinary_clinics")
      .delete()
      .eq("id", veterinaryId);

    if (error) {
      console.error("❌ Clinic delete failed:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete clinic." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Clinic deleted successfully.",
    });
  } catch (err) {
    console.error("🔥 Clinic delete route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}