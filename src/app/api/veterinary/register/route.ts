import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/sendEmail";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import type {  PostgrestSingleResponse } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    // ✅ 1️⃣ Basic Validation
    if (!formData.email || !formData.clinicName || !formData.password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ FIXED: Proper typing for Promise.allSettled results
    type EmailCheckResult = PostgrestSingleResponse<{ id: string } | null>;
    const emailChecks = await Promise.allSettled<EmailCheckResult>([
      supabaseServerClient
        .from("owners")
        .select("id")
        .eq("email", formData.email.trim().toLowerCase())
        .maybeSingle(),
      
      supabaseServerClient
        .from("admins")
        .select("id")
        .eq("email", formData.email.trim().toLowerCase())
        .maybeSingle(),
      
      supabaseServerClient
        .from("veterinary_clinics")
        .select("id")
        .eq("email", formData.email.trim().toLowerCase())
        .maybeSingle()
    ]);

    // ✅ FIXED: Proper loop structure with correct scoping
    for (let i = 0; i < emailChecks.length; i++) {
      const checkResult = emailChecks[i];
      
      if (checkResult.status === 'rejected') {
        console.error(`Email check error in table ${i}:`, (checkResult as PromiseRejectedResult).reason);
        return NextResponse.json(
          { success: false, message: "Server error while checking email uniqueness." },
          { status: 500 }
        );
      }
      
      const result = checkResult as PromiseFulfilledResult<EmailCheckResult>;
      if (result.value.error) {
        console.error(`Email check error in table ${i}:`, result.value.error);
        return NextResponse.json(
          { success: false, message: "Server error while checking email uniqueness." },
          { status: 500 }
        );
      }
      
      if (result.value.data) {
        const tableNames = ['owners', 'admins', 'veterinary_clinics'];
        return NextResponse.json(
          { 
            success: false, 
            message: `Registration Error: Email already registered in ${tableNames[i]}.` 
          },
          { status: 400 }
        );
      }
    }

    // ✅ 2️⃣ Hash Password
    const hashedPassword = await bcrypt.hash(formData.password, 12);

    // ✅ 3️⃣ Normalize data for Supabase
    const cleanData = {
      email: formData.email.trim().toLowerCase(),
      password_hash: hashedPassword,
      clinic_name: formData.clinicName,
      contact_person: formData.contact_person || null,
      license_number: formData.veterinaryLicenseNumber || null,
      phone: formData.phone || null,
      alt_phone: formData.alt_phone || null,
      website: formData.website || null,
      years_in_practice: formData.yearsInPractice ?? null,
      street_address: formData.streetAddress || null,
      city: formData.city || null,
      state_province: formData.stateProvince || null,
      postal_code: formData.postalCode || null,
      country: formData.country || null,
      operating_hours: formData.operatingHours || null,
      provides_24h_emergency: !!formData.provides24HourEmergency,
      microchip_services: !!formData.microchip_services,
      has_microchip_scanners: !!formData.hasMicrochipScanners,
      

      // ✅ Convert single text → array if needed
      scanner_types: Array.isArray(formData.scannerTypes)
        ? formData.scannerTypes
        : formData.scannerTypes
        ? [formData.scannerTypes]
        : [],

      additional_services: Array.isArray(formData.additionalServices)
        ? formData.additionalServices
        : formData.additionalServices
        ? [formData.additionalServices]
        : [],

      specializations: Array.isArray(formData.specializations)
        ? formData.specializations
        : formData.specializations
        ? [formData.specializations]
        : [],

      // ✅ Legal confirmations
      terms_accepted: !!formData.termsAccepted,
      data_accuracy_confirmed: !!formData.dataAccuracyConfirmed,
      professional_confirmation: !!formData.professionalConfirmation,
      consent_for_referrals: !!formData.consentForReferrals,
      email_updates_opt_in: !!formData.emailUpdatesOptIn,
      google_maps_url: formData.googleMapsUrl || null,

      // ✅ Default verification fields
      is_verified: false,
      status: "pending",
    };

    // ✅ 4️⃣ Insert into Database using Supabase
    const { data, error } = await supabaseServerClient
      .from("veterinary_clinics")
      .insert([cleanData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Database insert failed.", error },
        { status: 500 }
      );
    }

    // ✅ 5️⃣ Send Notification Email to Admin
    await sendEmail({
      to: "info@chipthem.com",
      subject: "🐶 New Veterinary Clinic Registration",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd;">
          <h2>🚨 New Veterinary Clinic Registration for Verification</h2>
          <p>A new veterinary clinic has registered and requires <strong>manual verification</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

          <h3>🏥 Clinic Details (DB ID: ${data.id})</h3>
          <p><strong>Clinic Name:</strong> ${formData.clinicName}</p>
          <p><strong>Contact Person:</strong> ${formData.contact_person || 'N/A'}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
          <p><strong>License Number:</strong> ${formData.veterinaryLicenseNumber || 'N/A'}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <h3>Location</h3>
          <p><strong>Address:</strong> ${formData.streetAddress || 'N/A'}, ${formData.city || 'N/A'}</p>
          <p><strong>Country:</strong> ${formData.country || 'N/A'}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <h3>Services</h3>
          <p><strong>Microchip Services:</strong> ${formData.microchip_services ? 'Yes' : 'No'}</p>
          <p><strong>Has Scanners:</strong> ${formData.hasMicrochipScanners ? 'Yes' : 'No'}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p style="font-weight: bold; color: red;">ACTION REQUIRED:</p>
          <p>
            Please review and approve this clinic in your admin panel:
            <a 
              href="https://chipthem.com/admin/verifications/veterinary" 
              target="_blank" 
              style="
                display: inline-block; 
                padding: 10px 20px; 
                background-color: #007bff; 
                color: white !important; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;
              "
            >
              Go to Veterinary Verifications
            </a>
          </p>
        </div>
      `,
    });

    // ✅ 6️⃣ Send Confirmation Email to the User
    await sendEmail({
      to: formData.email,
      subject: "✅ Thank you for registering your veterinary clinic",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
          <h2>Thank you, ${formData.contact_person || "Doctor"}!</h2>
          <p>We've received your clinic registration for <strong>${formData.clinicName}</strong>.</p>
          <p>Your submission is currently <strong>pending verification</strong> by our admin team.</p>
          <p>Once verified, you'll receive a confirmation email and your clinic will become active.</p>
          <p>This review process typically takes <strong>24–48 hours</strong>.</p>
          <br/>
          <p>— ChipThem Team 🐾</p>
        </div>
      `,
    });

    // ✅ 7️⃣ Respond to Client
    return NextResponse.json({
      success: true,
      message: "Clinic registered successfully and notification emails sent.",
      data,
    });

  } catch (err) {
    console.error("Veterinary register error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
