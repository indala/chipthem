import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { getLatLngFromGoogleMapsUrl } from "@/hooks/getLatLngFromGoogleMapsUrl";
import { sendEmail } from "@/utils/sendEmail";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ vetId: string }> }
) {
  const { vetId } = await params;

  try {
    // 1️⃣ Fetch veterinary clinic including email + name
    const { data: vetData, error: vetFetchError } = await supabaseServerClient
      .from("veterinary_clinics")
      .select(
        "id, is_verified, subscription_status, subscribed_at, subscription_expires_at, google_maps_url, latitude, longitude, email, clinic_name"
      )
      .eq("id", vetId)
      .single();

    if (vetFetchError || !vetData) {
      return NextResponse.json(
        { success: false, message: "Veterinary clinic not found." },
        { status: 404 }
      );
    }

    const now = new Date();

    let newSubscriptionStatus = vetData.subscription_status;
    let subscribedAt = vetData.subscribed_at;
    let subscriptionExpiresAt = vetData.subscription_expires_at;

    let clinicJustVerified = false;

    // 2️⃣ If clinic is not verified, verify it + set yearly subscription
    if (!vetData.is_verified) {
      if (!vetData.subscription_status || vetData.subscription_status === "Not Subscribed") {
        newSubscriptionStatus = "active";
        subscribedAt = now.toISOString();

        const expires = new Date(now);
        expires.setFullYear(expires.getFullYear() + 1);
        subscriptionExpiresAt = expires.toISOString();
      }

      // 🔹 Try to fill latitude/longitude from google_maps_url if missing
      let latitude = vetData.latitude;
      let longitude = vetData.longitude;

      if (vetData.google_maps_url && (!latitude || !longitude)) {
        try {
          const { lat, lng } = await getLatLngFromGoogleMapsUrl(
            vetData.google_maps_url
          );
          latitude = lat;
          longitude = lng;
        } catch (e) {
          console.error("Failed to get lat/lng from Google Maps URL:", e);
        }
      }

      const { error: vetUpdateError } = await supabaseServerClient
        .from("veterinary_clinics")
        .update({
          is_verified: true,
          status: "verified",
          verified_at: now.toISOString(),
          subscription_status: newSubscriptionStatus,
          subscribed_at: subscribedAt,
          subscription_expires_at: subscriptionExpiresAt,
          latitude,
          longitude,
        })
        .eq("id", vetId);

      if (vetUpdateError) {
        console.error("Error updating vet:", vetUpdateError);
        return NextResponse.json(
          { success: false, message: "Failed to verify veterinary clinic." },
          { status: 500 }
        );
      }

      clinicJustVerified = true;
    }

    // 3️⃣ Send verification email to clinic (only if just verified)
    if (clinicJustVerified && vetData.email) {
      try {
        await sendEmail({
          to: vetData.email,
          subject: `✅ Your veterinary clinic "${vetData.clinic_name ?? ""}" is now verified on ChipThem`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>🎉 Congratulations${vetData.clinic_name ? `, ${vetData.clinic_name}` : ""}!</h2>
              <p>Your veterinary clinic has been <strong>successfully verified</strong> and activated on ChipThem.</p>

              <div style="background: #f3f6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
                <h3>🏥 Clinic Details</h3>
                <p><strong>Name:</strong> ${vetData.clinic_name || "Your clinic"}</p>
                <p><strong>Status:</strong> Verified</p>
                <p><strong>Subscription:</strong> ${newSubscriptionStatus || "Not Subscribed"}</p>
                ${
                  subscriptionExpiresAt
                    ? `<p><strong>Valid Until:</strong> ${new Date(subscriptionExpiresAt).toDateString()}</p>`
                    : ""
                }
              </div>

              <br/>
              <p>You can now access your clinic dashboard, manage listings, and handle pet verifications.</p>
              <a
                href="https://chipthem.com/vlogin"
                style="display: inline-block; padding: 12px 24px; background: #28a745; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 8px;"
              >
                🔐 Go to Clinic Login
              </a>

              <br/><br/>
              <p>If you did not request this verification or believe this is a mistake, please contact support immediately.</p>
              <p>Best regards,<br/><strong>The ChipThem Team</strong></p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send vet verification email:", emailError);
        // Do not fail the response because verification already succeeded
      }
    }

    return NextResponse.json({
      success: true,
      message: `Veterinary clinic (${vetId}) verified successfully with yearly subscription.`,
    });
  } catch (err) {
    console.error("Vet verify route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
