import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { sendEmail } from '@/utils/sendEmail';
import type { LostReport, ReportStatus } from '@/types/types';

type LostReportInsert = Omit<LostReport, 'id' | 'created_at'>;

/**
 * Cloudflare-safe uploaded file type
 */
type UploadedPetFile = Blob & {
  name?: string;
};

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
  loss_circumstances?: string;
  microchip?: string;
  owner_name?: string;
  phone?: string;
  email?: string;
  alt_phone?: string;
  [key: string]: FormDataEntryValue | undefined;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data: LostPetFormData = {};
    let petFile: UploadedPetFile | null = null;
    let petFileName: string | null = null;

    // Separate form fields and uploaded image
    formData.forEach((value, key) => {
      if (key === 'pet_photo' && typeof value !== 'string') {
        const file = value as UploadedPetFile;
        petFile = file;
        petFileName = file.name ?? `pet_${Date.now()}`;
      } else {
        data[key] = value;
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

    // Insert lost pet report
    const insertPayload: LostReportInsert = {
      pet_name: (data.pet_name as string) ?? null,
      pet_type: (data.pet_type as string) ?? null,
      color: (data.color as string) ?? null,
      size: (data.size as string) ?? null,
      pet_photo: imageUrl,
      last_seen_location: (data.last_seen_location as string) ?? null,
      status: 'unresolved' as ReportStatus,
      breed: (data.breed as string) ?? null,
      microchip: (data.microchip as string) ?? null,
      date_lost: (data.date_lost as string) ?? null,
      time_lost: (data.time_lost as string) ?? null,
      loss_circumstances: (data.loss_circumstances as string) ?? null,
      owner_name: (data.owner_name as string) ?? null,
      phone: (data.phone as string) ?? null,
      email: (data.email as string) ?? null,
      alt_phone: (data.alt_phone as string) ?? null
    };

    const { error: insertError } = await supabaseServerClient
      .from('lost_reports')
      .insert([insertPayload]);

    if (insertError) {
      throw new Error(`Failed to save report: ${insertError.message}`);
    }

    // Confirmation email to owner
    if (data.email) {
      await sendEmail({
        to: data.email.toString(),
        subject: 'Your Lost Pet Report Has Been Received',
        html: `
          <h1>Thank you for your report</h1>
          <p>We have received your lost pet report for <strong>${data.pet_name ?? 'your pet'}</strong>.</p>
          <p>We will notify you as soon as we have any updates.</p>
        `
      });
    }

    // Admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🐾 New Lost Pet Report</h2>
        <hr>

        <h3>Pet Details</h3>
        <ul>
          <li><strong>Pet Name:</strong> ${data.pet_name || 'N/A'}</li>
          <li><strong>Pet Type:</strong> ${data.pet_type || 'N/A'}</li>
          <li><strong>Breed:</strong> ${data.breed || 'N/A'}</li>
          <li><strong>Size:</strong> ${data.size || 'N/A'}</li>
          <li><strong>Primary Color:</strong> ${data.color || 'N/A'}</li>
          <li><strong>Sex:</strong> ${data.sex || 'N/A'}</li>
        </ul>

        <h3>Loss Information</h3>
        <ul>
          <li><strong>Date Lost:</strong> ${data.date_lost || 'N/A'}</li>
          <li><strong>Time Lost:</strong> ${data.time_lost || 'N/A'}</li>
          <li><strong>Last Seen At:</strong> ${data.last_seen_location || 'N/A'}</li>
        </ul>

        <h3>Owner Contact</h3>
        <ul>
          <li><strong>Name:</strong> ${data.owner_name || 'N/A'}</li>
          <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
          <li><strong>Email:</strong> ${data.email || 'N/A'}</li>
        </ul>

        ${
          imageUrl
            ? `
          <h3>Pet Photo</h3>
          <a href="${imageUrl}" target="_blank">
            <img src="${imageUrl}" alt="Lost Pet" style="max-width: 300px; border-radius: 8px;" />
          </a>
        `
            : ''
        }

        <hr>
        <p style="font-size: 0.9em; color: #777;">Automated notification</p>
      </div>
    `;

    await sendEmail({
      to: 'info@chipthem.com',
      subject: `New Lost Pet Report: ${data.pet_name ?? 'Unnamed Pet'}`,
      html: adminEmailHtml
    });

    return NextResponse.json(
      { message: 'Lost pet report received successfully!' },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('Error handling lost pet report:', message);

    return NextResponse.json(
      { message: `Failed to submit lost pet report: ${message}` },
      { status: 500 }
    );
  }
}
