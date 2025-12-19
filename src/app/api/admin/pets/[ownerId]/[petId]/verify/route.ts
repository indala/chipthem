import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { sendEmail } from "@/utils/sendEmail";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ ownerId: string; petId: string }> }
) {
  const { ownerId, petId } = await params;

  try {
    // 1️⃣ Fetch owner (with email + name for notification)
    const { data: ownerData, error: ownerFetchError } = await supabaseServerClient
      .from("owners")
      .select("id, is_verified, email, full_name")
      .eq("id", ownerId)
      .single();

    if (ownerFetchError || !ownerData) {
      return NextResponse.json(
        { success: false, message: "Owner not found." },
        { status: 404 }
      );
    }

    // 2️⃣ Verify owner if needed
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
        return NextResponse.json(
          { success: false, message: "Failed to verify owner." },
          { status: 500 }
        );
      }
    }

    // 3️⃣ Check pet ownership (also fetch some fields for email)
    const { data: petData, error: petFetchError } = await supabaseServerClient
      .from("pets")
      .select(
        "id, owner_id, is_verified, subscription_status, subscribed_at, subscription_expires_at, pet_name, microchip_number"
      )
      .eq("id", petId)
      .single();

    if (petFetchError || !petData) {
      return NextResponse.json(
        { success: false, message: "Pet not found." },
        { status: 404 }
      );
    }

    if (petData.owner_id !== ownerId) {
      return NextResponse.json(
        { success: false, message: "Pet does not belong to this owner." },
        { status: 400 }
      );
    }

    // 4️⃣ Verify pet + handle yearly subscription
    const now = new Date();
    let newSubscriptionStatus = petData.subscription_status;
    let subscribedAt = petData.subscribed_at;
    let subscriptionExpiresAt = petData.subscription_expires_at;

    let petJustVerified = false;

    if (!petData.is_verified) {
      // If no subscription or 'Not Subscribed', create a new yearly subscription
      if (!petData.subscription_status || petData.subscription_status === "Not Subscribed") {
        newSubscriptionStatus = "active";
        subscribedAt = now.toISOString();
        const expires = new Date(now);
        expires.setFullYear(expires.getFullYear() + 1);
        subscriptionExpiresAt = expires.toISOString();
      }

      const { error: petVerifyError } = await supabaseServerClient
        .from("pets")
        .update({
          is_verified: true,
          status: "verified",
          verified_at: now.toISOString(),
          subscription_status: newSubscriptionStatus,
          subscribed_at: subscribedAt,
          subscription_expires_at: subscriptionExpiresAt,
        })
        .eq("id", petId);

      if (petVerifyError) {
        return NextResponse.json(
          { success: false, message: "Failed to verify pet." },
          { status: 500 }
        );
      }

      petJustVerified = true;
    }

    // 5️⃣ Send verification email to owner (only if pet was just verified)
    if (petJustVerified && ownerData.email) {
      try {
        await sendEmail({
          to: ownerData.email,
          subject: `✅ Your pet ${petData.pet_name ?? ""} has been verified on ChipThem`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>🎉 Hi ${ownerData.full_name || "there"}, your pet is now verified!</h2>
              <p>Your pet registration has been <strong>successfully verified</strong> and is now active in the ChipThem system.</p>

              <div style="background: #f3f6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
                <h3>🐾 Pet Details</h3>
                <p><strong>Name:</strong> ${petData.pet_name || "Your pet"}</p>
                <p><strong>Microchip Number:</strong> ${petData.microchip_number}</p>
                <p><strong>Status:</strong> Verified</p>
                <p><strong>Subscription:</strong> ${newSubscriptionStatus || "Not Subscribed"}</p>
                ${
                  subscriptionExpiresAt
                    ? `<p><strong>Valid Until:</strong> ${new Date(subscriptionExpiresAt).toDateString()}</p>`
                    : ""
                }
              </div>

              <br/>
              <p>You can manage your pet's profile and details any time from your dashboard.</p>
              <a
                href="https://chipthem.com/pologin"
                style="display: inline-block; padding: 12px 24px; background: #28a745; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 8px;"
              >
                🔐 Go to Owner Login
              </a>

              <br/><br/>
              <p>If you did not request this verification or believe this is a mistake, please contact support immediately.</p>
              <p>Warm regards,<br/><strong>The ChipThem Team</strong></p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Do not fail the request because verification already succeeded
      }
    }

    return NextResponse.json({
      success: true,
      message: `Owner (${ownerId}) and pet (${petId}) verified successfully with yearly subscription.`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
