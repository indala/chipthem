import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { sendEmail } from '@/utils/sendEmail';
import type { FoundReport, ReportStatus } from '@/types/types';

type FoundReportInsert = Omit<FoundReport, 'id' | 'created_at'>;

/**
 * Cloudflare-safe uploaded file type
 * Blob exists in Workers, File does not (typing-wise)
 */
type UploadedPetFile = Blob & {
  name?: string;
};

interface FoundPetFormData {
  pet_type?: string;
  size?: string;
  color?: string;
  description?: string;
  date_found?: string;
  time_found?: string;
  found_location?: string;
  finder_name?: string;
  phone?: string;
  email?: string;
  current_location?: string;
  [key: string]: FormDataEntryValue | undefined;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fields: FoundPetFormData = {};
    let petFile: UploadedPetFile | null = null;
    let petFileName: string | null = null;

    // Separate form fields and uploaded file
    formData.forEach((value, key) => {
      if (key === 'pet_photo' && typeof value !== 'string') {
        const file = value as UploadedPetFile;
        petFile = file;
        petFileName = file.name ?? `pet_${Date.now()}`;
      } else {
        fields[key] = value;
      }
    });

    let imageUrl: string | null = null;

    // Upload image to Supabase Storage
    if (petFile && petFileName) {
      const storageFileName = `${Date.now()}_${petFileName}`;

      const { data: uploaded, error: uploadError } =
        await supabaseServerClient.storage
          .from('pet_photos')
          .upload(storageFileName, petFile);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: publicUrlData } =
        supabaseServerClient.storage
          .from('pet_photos')
          .getPublicUrl(uploaded.path);

      imageUrl = publicUrlData.publicUrl;
    }

    // Insert found pet report
    const insertPayload: FoundReportInsert = {
      pet_type: (fields.pet_type as string) ?? null,
      color: (fields.color as string) ?? null,
      size: (fields.size as string) ?? null,
      pet_photo: imageUrl,
      found_location: (fields.found_location as string) ?? null,
      status: 'unresolved' as ReportStatus,
      description: (fields.description as string) ?? null,
      date_found: (fields.date_found as string) ?? null,
      time_found: (fields.time_found as string) ?? null,
      finder_name: (fields.finder_name as string) ?? null,
      phone: (fields.phone as string) ?? null,
      email: (fields.email as string) ?? null,
      current_location: (fields.current_location as string) ?? null
    };

    const { error: insertError } = await supabaseServerClient
      .from('found_reports')
      .insert([insertPayload]);

    if (insertError) {
      throw new Error(`Failed to save report: ${insertError.message}`);
    }

    // Send confirmation email to finder
    if (fields.email) {
      await sendEmail({
        to: fields.email.toString(),
        subject: 'Thank You for Reporting a Found Pet',
        html: `
          <h1>Thank you for your report</h1>
          <p>We have received your found pet report. We will review the information and contact you if we have a match.</p>
          <p>Your help in reuniting a pet with its owner is greatly appreciated.</p>
        `
      });
    }

    // Admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🐾 New Found Pet Report</h2>
        <hr>

        <h3>Pet Details</h3>
        <ul>
          <li><strong>Type:</strong> ${fields.pet_type || 'N/A'}</li>
          <li><strong>Size:</strong> ${fields.size || 'N/A'}</li>
          <li><strong>Color:</strong> ${fields.color || 'N/A'}</li>
          <li><strong>Description:</strong> ${fields.description || 'N/A'}</li>
        </ul>

        <h3>Location</h3>
        <ul>
          <li><strong>Date Found:</strong> ${fields.date_found || 'N/A'}</li>
          <li><strong>Time Found:</strong> ${fields.time_found || 'N/A'}</li>
          <li><strong>Found At:</strong> ${fields.found_location || 'N/A'}</li>
          <li><strong>Current Location:</strong> ${fields.current_location || 'N/A'}</li>
        </ul>

        <h3>Finder Info</h3>
        <ul>
          <li><strong>Name:</strong> ${fields.finder_name || 'N/A'}</li>
          <li><strong>Phone:</strong> ${fields.phone || 'N/A'}</li>
          <li><strong>Email:</strong> ${fields.email || 'N/A'}</li>
        </ul>

        ${
          imageUrl
            ? `
          <h3>Pet Photo</h3>
          <a href="${imageUrl}" target="_blank">
            <img src="${imageUrl}" style="max-width: 300px; border-radius: 8px;" />
          </a>
        `
            : ''
        }

        <hr>
        <p style="font-size: 0.9em; color: #777;">Automated message</p>
      </div>
    `;

    await sendEmail({
      to: 'info@chipthem.com',
      subject: 'New Found Pet Report',
      html: adminEmailHtml
    });

    return NextResponse.json(
      { message: 'Found pet report received successfully' },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('Error handling found pet report:', message);

    return NextResponse.json(
      { message: `Failed to submit found pet report: ${message}` },
      { status: 500 }
    );
  }
}
