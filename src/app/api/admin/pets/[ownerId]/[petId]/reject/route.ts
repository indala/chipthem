import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
// import { verifyTokenAndGetPayload } from "@/lib/auth"; // REMOVED

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ ownerId: string; petId: string }> }
) {
  // const payload = await verifyTokenAndGetPayload(); // REMOVED
  // if (!payload || payload.role !== 'admin') { // REMOVED
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // REMOVED
  // } // REMOVED

  const { ownerId, petId } = await params;

  try {
    // 1️⃣ Fetch owner info
    const { data: owner, error: ownerFetchError } = await supabaseServerClient
      .from("owners")
      .select("id, is_verified")
      .eq("id", ownerId)
      .single();

    if (ownerFetchError || !owner) {
      console.error("Owner fetch error:", ownerFetchError);
      return NextResponse.json(
        { success: false, message: "Owner not found." },
        { status: 404 }
      );
    }

    // 2️⃣ If owner is verified → only delete that specific pet
    if (owner.is_verified) {
      const { error: petDeleteError } = await supabaseServerClient
        .from("pets")
        .delete()
        .eq("id", petId)
        .eq("owner_id", ownerId);

      if (petDeleteError) {
        console.error("Pet delete error:", petDeleteError);
        return NextResponse.json(
          { success: false, message: "Failed to delete pet." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Pet deleted successfully (owner remains verified).",
      });
    }

    // 3️⃣ If owner is NOT verified → delete all pets first
    const { error: allPetsDeleteError } = await supabaseServerClient
      .from("pets")
      .delete()
      .eq("owner_id", ownerId);

    if (allPetsDeleteError) {
      console.error("All pets delete error:", allPetsDeleteError);
      return NextResponse.json(
        { success: false, message: "Failed to delete associated pets." },
        { status: 500 }
      );
    }

    // 4️⃣ Then delete owner
    const { error: ownerDeleteError } = await supabaseServerClient
      .from("owners")
      .delete()
      .eq("id", ownerId);

    if (ownerDeleteError) {
      console.error("Owner delete error:", ownerDeleteError);
      return NextResponse.json(
        { success: false, message: "Failed to delete owner." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Owner and all associated pets deleted successfully (owner was not verified).",
    });
  } catch (err) {
    console.error("Delete route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}