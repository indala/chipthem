import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { sendEmail } from "@/utils/sendEmail";

interface LostPetFormData {
  pet_name?: string;
  pet_type?: string;
  breed?: string;
  size?: string;
  color?: string;
  sex?: string;
  date_lost?: string;
  time_lost?: string;
  last_seen_location?: string;
  owner_name?: string;
  phone?: string;
  email?: string;
  [key: string]: FormDataEntryValue | undefined;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: LostPetFormData = {};
    let file: File | null = null;

    formData.forEach((value, key) => {
      if (key === "pet_photo") {
        file = value as File;
      } else {
        data[key] = value;
      }
    });

    let imageUrl: string | null = null;

    // Upload image to Supabase storage
    if (file) {
      const uploadResult = await supabaseServerClient.storage
        .from("pet-images")
        .upload(`${Date.now()}_${(file as File).name}`, file);

      if (uploadResult.error) {
        throw new Error(`Failed to upload image: ${uploadResult.error.message}`);
      }

      const { data: urlData } = supabaseServerClient.storage
        .from("pet-images")
        .getPublicUrl(uploadResult.data.path);

      imageUrl = urlData.publicUrl;
    }

    // Insert report into Supabase table
    const insertResult = await supabaseServerClient
      .from("lost_reports")
      .insert([
        {
          ...data,
          pet_photo: imageUrl,
        },
      ]);

    if (insertResult.error) {
      throw new Error(`Failed to save report: ${insertResult.error.message}`);
    }

    // Send confirmation email to the reporter
    if (data.email) {
      await sendEmail({
        to: data.email.toString(),
        subject: "Your Lost Pet Report Has Been Received",
        html: `
          <h1>Thank you for your report</h1>
          <p>We have received your lost pet report for <strong>${data.pet_name ?? "your pet"}</strong>.</p>
          <p>We will notify you as soon as we have any updates.</p>
        `,
      });
    }

    // Build admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Lost Pet Report</h2>
        <p>A new report for a lost pet has been submitted. Here are the details:</p>
        <hr>

        <h3 style="color: #555;">Pet Details</h3>
        <ul>
          <li><strong>Pet Name:</strong> ${data.pet_name || "N/A"}</li>
          <li><strong>Pet Type:</strong> ${data.pet_type || "N/A"}</li>
          <li><strong>Breed:</strong> ${data.breed || "N/A"}</li>
          <li><strong>Size:</strong> ${data.size || "N/A"}</li>
          <li><strong>Primary Color:</strong> ${data.color || "N/A"}</li>
          <li><strong>Sex:</strong> ${data.sex || "N/A"}</li>
        </ul>

        <h3 style="color: #555;">Circumstances</h3>
        <ul>
          <li><strong>Date Lost:</strong> ${data.date_lost || "N/A"}</li>
          <li><strong>Time Lost:</strong> ${data.time_lost || "N/A"}</li>
          <li><strong>Location Lost:</strong> ${data.last_seen_location || "N/A"}</li>
        </ul>

        <h3 style="color: #555;">Owner's Contact Information</h3>
        <ul>
          <li><strong>Owner's Name:</strong> ${data.owner_name || "N/A"}</li>
          <li><strong>Phone:</strong> ${data.phone || "N/A"}</li>
          <li><strong>Email:</strong> ${data.email || "N/A"}</li>
        </ul>

        ${imageUrl ? `
          <h3 style="color: #555;">Pet Photo</h3>
          <p>
            <a href="${imageUrl}" target="_blank">
              <img src="${imageUrl}" alt="Lost Pet" style="max-width: 300px; border-radius: 8px;" />
            </a>
          </p>
          <p><a href="${imageUrl}" target="_blank">View full size image</a></p>
        ` : ""}

        <hr>
        <p style="font-size: 0.9em; color: #777;">
          This is an automated notification.
        </p>
      </div>
    `;

    // Send notification to admin
    await sendEmail({
      to: "info@chipthem.com",
      subject: `New Lost Pet Report: ${data.pet_name ?? "Unnamed Pet"}`,
      html: adminEmailHtml,
    });

    return NextResponse.json(
      { message: "Lost pet report received successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Error handling lost pet report:", errorMessage);

    return NextResponse.json(
      { message: `Failed to submit lost pet report: ${errorMessage}` },
      { status: 500 }
    );
  }
}
