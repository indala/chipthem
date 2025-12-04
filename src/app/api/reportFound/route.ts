import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fields: Record<string, string> = {};
    let petFile: File | null = null;

    // Separate fields and file from FormData
    formData.forEach((value, key) => {
      if (key === "pet_photo" && value instanceof File) {
        petFile = value;
      } else {
        fields[key] = String(value);
      }
    });

    let imageUrl: string | null = null;

    // --- Upload Image to Supabase ---
    if (petFile) {
      const fileName = `${Date.now()}_${(petFile as File).name}`;
      const { data: uploaded, error: uploadError } = await supabaseServerClient.storage
        .from("pet-images")
        .upload(fileName, petFile);

      if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`);

      const { data: publicUrlData } = supabaseServerClient.storage
        .from("pet-images")
        .getPublicUrl(uploaded.path);

      imageUrl = publicUrlData.publicUrl;
    }

    // --- Insert Record into Database ---
    const { error: insertError } = await supabaseServerClient
      .from("found_pet_reports") // ✅ Make sure table name matches in Supabase
      .insert([
        {
          ...fields,
          pet_photo: imageUrl,
        },
      ]);

    if (insertError) throw new Error(`Failed to save report: ${insertError.message}`);

    // --- Send Confirmation to Finder ---
    await sendEmail({
      to: fields.email,
      subject: "Thank You for Reporting a Found Pet",
      html: `
        <h1>Thank you for your report</h1>
        <p>We have received your found pet report. We will review the information and contact you if we have a match.</p>
        <p>Your help in reuniting a pet with its owner is greatly appreciated.</p>
      `,
    });

    // --- Send Notification to Admin ---
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">🐾 New Found Pet Report</h2>
        <p>A new report for a found pet has been submitted:</p>
        <hr>

        <h3>Pet Details</h3>
        <ul>
          <li><strong>Type:</strong> ${fields.pet_type || "N/A"}</li>
          <li><strong>Size:</strong> ${fields.size || "N/A"}</li>
          <li><strong>Color:</strong> ${fields.color || "N/A"}</li>
          <li><strong>Description:</strong> ${fields.description || "N/A"}</li>
        </ul>

        <h3>Location</h3>
        <ul>
          <li><strong>Date Found:</strong> ${fields.date_found || "N/A"}</li>
          <li><strong>Time Found:</strong> ${fields.time_found || "N/A"}</li>
          <li><strong>Found At:</strong> ${fields.found_location || "N/A"}</li>
          <li><strong>Current Location:</strong> ${fields.current_location || "N/A"}</li>
        </ul>

        <h3>Finder Info</h3>
        <ul>
          <li><strong>Name:</strong> ${fields.finder_name || "N/A"}</li>
          <li><strong>Phone:</strong> ${fields.phone || "N/A"}</li>
          <li><strong>Email:</strong> ${fields.email || "N/A"}</li>
        </ul>

        ${imageUrl ? `
          <h3>Pet Photo</h3>
          <a href="${imageUrl}" target="_blank">
            <img src="${imageUrl}" alt="Found Pet" style="max-width: 300px; border-radius: 8px;" />
          </a>
          <p><a href="${imageUrl}" target="_blank">View full image</a></p>
        ` : ""}

        <hr>
        <p style="font-size: 0.9em; color: #777;">This is an automated email.</p>
      </div>
    `;

    await sendEmail({
      to: "info@chipthem.com",
      subject: "New Found Pet Report",
      html: adminEmailHtml,
    });

    return NextResponse.json(
      { message: "✅ Found pet report received successfully!" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error handling found pet report:", message);

    return NextResponse.json(
      { message: `Failed to submit found pet report: ${message}` },
      { status: 500 }
    );
  }
}
