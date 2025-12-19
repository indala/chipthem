// /api/admin/pets/[petId]/route.ts
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
// import { verifyTokenAndGetPayload } from "@/lib/auth"; // REMOVED

export async function PATCH(req: Request, { params }: { params: Promise<{ petId: string }> }) {
  // const payload = await verifyTokenAndGetPayload(); // REMOVED
  // if (!payload || payload.role !== "admin") { // REMOVED
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // REMOVED
  // } // REMOVED

  const { petId } = await params;

  try {
    const updates = await req.json();

    // Fetch current pet data
    const { data: pet, error: petFetchError } = await supabaseServerClient
      .from("pets")
      .select("*")
      .eq("id", petId)
      .single();

    if (petFetchError || !pet) {
      return NextResponse.json({ success: false, message: "Pet not found." }, { status: 404 });
    }

    // Compute subscription status
    const now = new Date();
    const subscribedAt = updates.subscribed_at ? new Date(updates.subscribed_at) : pet.subscribed_at ? new Date(pet.subscribed_at) : null;
    const subscriptionExpiresAt = updates.subscription_expires_at ? new Date(updates.subscription_expires_at) : pet.subscription_expires_at ? new Date(pet.subscription_expires_at) : null;

    let subscription_status = pet.subscription_status || "none";

    if (subscriptionExpiresAt) {
      if (subscriptionExpiresAt < now) subscription_status = "expired";
      else subscription_status = "active";

      // Optional: handle grace_period (e.g., last 7 days)
      const gracePeriodDays = 7;
      const diffDays = (subscriptionExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays <= gracePeriodDays) subscription_status = "grace_period";
    }

    const finalUpdates = {
      ...updates,
      subscription_status,
    };

    const { error: updateError } = await supabaseServerClient
      .from("pets")
      .update(finalUpdates)
      .eq("id", petId);

    if (updateError) {
      console.error("❌ Pet update failed:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update pet." },
        { status: 500 }
      );
    }

    // Prepare subscription timeline for frontend
    const timeline = subscribedAt && subscriptionExpiresAt ? {
      subscribed_at: subscribedAt.toISOString(),
      subscription_expires_at: subscriptionExpiresAt.toISOString(),
      remaining_days: Math.ceil((subscriptionExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      status: subscription_status,
    } : null;

    return NextResponse.json({
      success: true,
      message: "Pet updated successfully.",
      petId,
      subscriptionTimeline: timeline,
    });
  } catch (err) {
    console.error("🔥 Pet update route error:", err);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ petId: string }> }) {
  // const payload = await verifyTokenAndGetPayload(); // REMOVED
  // if (!payload || payload.role !== "admin") { // REMOVED
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // REMOVED
  // } // REMOVED

  const { petId } = await params;

  try {
    // 1️⃣ Find the owner_id of the pet to be deleted
    const { data: pet, error: petFetchError } = await supabaseServerClient
      .from("pets")
      .select("owner_id")
      .eq("id", petId)
      .single();

    if (petFetchError || !pet) {
      return NextResponse.json({ success: false, message: "Pet not found or already deleted." }, { status: 404 });
    }

    const { owner_id } = pet;

    // 2️⃣ Count the total number of pets for this owner
    // We use a count query to check the current number of pets *before* deletion.
    // The count will include the pet we are about to delete.
    const { count, error: countError } = await supabaseServerClient
      .from("pets")
      .select("id", { count: "exact" })
      .eq("owner_id", owner_id);

    if (countError) {
      console.error("Pet count failed:", countError);
      return NextResponse.json({ success: false, message: "Failed to check pet count." }, { status: 500 });
    }

    const petCount = count || 0;

    // Flag to determine if the owner should also be deleted
    const deleteOwner = petCount === 1;

    // 3️⃣ Delete the specific pet
    const { error: petDeleteError } = await supabaseServerClient
      .from("pets")
      .delete()
      .eq("id", petId);

    if (petDeleteError) {
      console.error("❌ Pet delete failed:", petDeleteError);
      return NextResponse.json({ success: false, message: "Failed to delete pet." }, { status: 500 });
    }

    let finalMessage = "Pet deleted successfully.";

    // 4️⃣ If count was 1, delete the owner and update the message
    if (deleteOwner) {
      const { error: ownerDeleteError } = await supabaseServerClient
        .from("owners")
        .delete()
        .eq("id", owner_id);

      if (ownerDeleteError) {
        // Log the owner deletion failure but still return success for the pet deletion
        // Alternatively, you might want to return a 500 if the owner deletion is critical
        console.error("❌ Owner delete failed after last pet was removed:", ownerDeleteError);
        finalMessage = "Pet deleted successfully, but failed to delete the owner (Owner ID: " + owner_id + ").";
      } else {
        finalMessage = "Pet and associated owner deleted successfully (owner had only one pet).";
      }
    }

    return NextResponse.json({ success: true, message: finalMessage });

  } catch (err) {
    console.error("🔥 Pet delete route error:", err);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}