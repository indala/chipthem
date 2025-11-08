import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/sendEmail";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

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

    // --- NEW STEP: 2.5 Check Email Uniqueness ---
    const { data: existingClinic, error: checkError } =
      await supabaseServerClient
        .from("veterinary_clinics")
        .select("id")
        .eq("email", formData.email.trim().toLowerCase())
        .maybeSingle();

    if (checkError) {
      console.error("Email check error:", checkError);
      return NextResponse.json(
        { success: false, message: "Server error while checking email uniqueness." },
        { status: 500 }
      );
    }

    if (existingClinic) {
      // ❌ Critical fix: Prevent duplicate registration
      return NextResponse.json(
        { success: false, message: "Registration Error: This email is already registered." },
        { status: 400 }
      );
    }
    // ---------------------------------------------

    // ✅ 2️⃣ Hash Password
    const hashedPassword = await bcrypt.hash(formData.password, 12);

    // ✅ 3️⃣ Normalize data for Supabase
    const cleanData = {
      email: formData.email.trim().toLowerCase(), // Use trimmed/lowercase email for consistency
      password: hashedPassword,
      clinic_name: formData.clinicName,
      contact_person: formData.contact_person || null,
      license_number: formData.veterinaryLicenseNumber || null,
      phone: formData.phone || null,
      alt_phone: formData.alt_phone || null,
      website: formData.website || null,
      years_in_practice: formData.yearsInPractice
        ? Number(formData.yearsInPractice)
        : null,
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
    // ✅ 5️⃣ Send Notification Email to Admin
await sendEmail({
 to: "info@chipthem.com",
 subject: "🐶 New Veterinary Clinic Registration",
 html: `
  <h2>New Veterinary Clinic Registration</h2>
 
  <hr/>
  <h3>Primary Details</h3>
  <p><strong>Clinic Name:</strong> ${formData.clinicName}</p>
  <p><strong>Contact Person:</strong> ${formData.contact_person || 'N/A'}</p>
  <p><strong>Email:</strong> ${formData.email}</p>
  <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
  <p><strong>Alt. Phone:</strong> ${formData.alt_phone || 'N/A'}</p>
  <p><strong>Website:</strong> ${formData.website || 'N/A'}</p>
  <p><strong>License Number:</strong> ${formData.veterinaryLicenseNumber || 'N/A'}</p>
  <p><strong>Years in Practice:</strong> ${formData.yearsInPractice || 'N/A'}</p>

  <hr/>
  <h3>Location</h3>
  <p><strong>Street Address:</strong> ${formData.streetAddress || 'N/A'}</p>
  <p><strong>City:</strong> ${formData.city || 'N/A'}</p>
  <p><strong>State/Province:</strong> ${formData.stateProvince || 'N/A'}</p>
  <p><strong>Postal Code:</strong> ${formData.postalCode || 'N/A'}</p>
  <p><strong>Country:</strong> ${formData.country || 'N/A'}</p>

  <hr/>
  <h3>Services & Operations</h3>
  <p><strong>Operating Hours:</strong> ${formData.operatingHours || 'N/A'}</p>
  <p><strong>24H Emergency:</strong> ${formData.provides24HourEmergency ? 'Yes' : 'No'}</p>
  <p><strong>Microchip Services:</strong> ${formData.microchip_services ? 'Yes' : 'No'}</p>
  <p><strong>Has Microchip Scanners:</strong> ${formData.hasMicrochipScanners ? 'Yes' : 'No'}</p>
  <p><strong>Scanner Types:</strong> ${Array.isArray(formData.scannerTypes) ? formData.scannerTypes.join(', ') : (formData.scannerTypes || 'N/A')}</p>
  <p><strong>Specializations:</strong> ${Array.isArray(formData.specializations) ? formData.specializations.join(', ') : (formData.specializations || 'N/A')}</p>
  <p><strong>Additional Services:</strong> ${Array.isArray(formData.additionalServices) ? formData.additionalServices.join(', ') : (formData.additionalServices || 'N/A')}</p>

  <hr/>
  <h3>Legal Confirmations</h3>
  <p><strong>Terms Accepted:</strong> ${formData.termsAccepted ? 'Yes' : 'No'}</p>
  <p><strong>Data Accuracy Confirmed:</strong> ${formData.dataAccuracyConfirmed ? 'Yes' : 'No'}</p>
  <p><strong>Professional Confirmation:</strong> ${formData.professionalConfirmation ? 'Yes' : 'No'}</p>
  <p><strong>Consent for Referrals:</strong> ${formData.consentForReferrals ? 'Yes' : 'No'}</p>
  <p><strong>Email Updates Opt-in:</strong> ${formData.emailUpdatesOptIn ? 'Yes' : 'No'}</p>

  <hr/>
  <p style="font-weight: bold; color: red;">ACTION REQUIRED:</p>
  <p>
   Please review and approve this clinic in your admin panel:
   <a 
    href="https://chipthem.com/admin/verifications/veterinary" 
    target="_blank" 
    style="
     display: inline-block; 
     padding: 8px 16px; 
     background-color: #007bff; 
     color: white !important; 
     text-decoration: none; 
     border-radius: 4px;
    "
   >
    Go to Veterinary Verifications
   </a>
  </p>
 `,
});

    // ✅ 6️⃣ Send Confirmation Email to the User
    await sendEmail({
      to: formData.email,
      subject: "✅ Thank you for registering your veterinary clinic",
      html: `
        <h2>Thank you, ${formData.contact_person || "Doctor"}!</h2>
        <p>We’ve received your clinic registration for <strong>${formData.clinicName}</strong>.</p>
        <p>Our team will review your details and get back to you shortly.</p>
        <p>— ChipThem Team 🐾</p>
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