import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/sendEmail";
import type {  PostgrestSingleResponse } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    // --- 1. Comprehensive Validation (Server-side) ---
    const requiredFields = [
      'fullName', 'email', 'password', 'phoneNumber', 'streetAddress',
      'city', 'country', 'microchipNumber', 'petName', 'petType', 'breed', 'sex', 'primaryColor',
      'termsAccepted', 'dataAccuracyConfirmed', 'ownershipConfirmed'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, message: `Validation Error: The field '${field}' is required.` },
          { status: 400 }
        );
      }
    }  
    // Add microchip length validation
    if (!/^\d{15}$/.test(formData.microchipNumber)) {
      return NextResponse.json(
        { success: false, message: "Validation Error: Microchip number must be exactly 15 digits." },
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

    // --- 2. CHECK UNIQUENESS: Microchip ---
    const { data: existingPet, error: petCheckError } = await supabaseServerClient
      .from("pets")
      .select("id")
      .eq("microchip_number", formData.microchipNumber.trim())
      .maybeSingle();

    if (petCheckError) {
      console.error("Microchip check error:", petCheckError);
      return NextResponse.json(
        { success: false, message: "Server error while checking microchip uniqueness." },
        { status: 500 }
      );
    }

    if (existingPet) {
      return NextResponse.json(
        { success: false, message: "Registration Error: Microchip number already registered." },
        { status: 400 }
      );
    }

    // --- 3. HASH PASSWORD ---
    const passwordHash = await bcrypt.hash(formData.password, 12);

    // --- 4. INSERT OWNER ---
    const { data: ownerData, error: ownerError } = await supabaseServerClient
      .from("owners")
      .insert([{
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password_hash: passwordHash,
        phone_number: formData.phoneNumber?.trim(),
        street_address: formData.streetAddress?.trim(),
        city: formData.city?.trim(),
        country: formData.country?.trim(),
        terms_accepted: formData.termsAccepted,
        data_accuracy_confirmed: formData.dataAccuracyConfirmed,
        ownership_confirmed: formData.ownershipConfirmed,
        is_verified: false,
        status: "pending",
      }])
      .select("id")
      .single();

    if (ownerError || !ownerData) {
      console.error("❌ Owner insert error:", ownerError);
      return NextResponse.json(
        { success: false, message: "Database Error: Failed to register owner." },
        { status: 500 }
      );
    }

    // --- 5. INSERT PET ---
    const { error: petError } = await supabaseServerClient
      .from("pets")
      .insert([{
        owner_id: ownerData.id,
        microchip_number: formData.microchipNumber.trim(),
        pet_name: formData.petName.trim(),
        pet_type: formData.petType?.trim(),
        breed: formData.breed?.trim(),
        sex: formData.sex?.trim(),
        primary_color: formData.primaryColor?.trim(),
        is_verified: false,
        status: "pending",
      }]);

    if (petError) {
      console.error("❌ Pet insert error:", petError);
      
      // CRITICAL ROLLBACK LOGIC: Delete the orphaned owner record
      const { error: ownerDeleteError } = await supabaseServerClient
        .from("owners")
        .delete()
        .eq("id", ownerData.id);

      if (ownerDeleteError) {
        console.error("⚠️ CRITICAL ROLLBACK FAILED: Orphaned owner record:", ownerDeleteError);
      } else {
        console.log(`✅ Orphaned Owner (ID: ${ownerData.id}) successfully rolled back.`);
      }

      return NextResponse.json(
        { success: false, message: "Database Error: Failed to register pet (Owner rolled back)." },
        { status: 500 }
      );
    }

    // --- 6. SEND ADMIN NOTIFICATION EMAIL ---
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd;">
        <h2>🚨 New Pet/Owner Registration for Verification</h2>
        <p>A new pet owner and pet have registered and require <strong>manual verification</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

        <h3>👤 Owner Details (DB ID: ${ownerData.id})</h3>
        <p><strong>Full Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
        <p><strong>Address:</strong> ${formData.streetAddress}, ${formData.city}, ${formData.country}</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

        <h3>🐶 Pet Details</h3>
        <p><strong>Pet Name:</strong> ${formData.petName}</p>
        <p><strong>Microchip Number:</strong> <strong style="color: blue;">${formData.microchipNumber}</strong></p>
        <p><strong>Pet Type:</strong> ${formData.petType}</p>
        <p><strong>Breed:</strong> ${formData.breed}</p>
        <p><strong>Sex:</strong> ${formData.sex}</p>
        <p><strong>Primary Color:</strong> ${formData.primaryColor}</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

        <h3>✅ Legal Confirmations</h3>
        <p><strong>Terms Accepted:</strong> ${formData.termsAccepted ? 'Yes' : 'No'}</p>
        <p><strong>Data Accuracy Confirmed:</strong> ${formData.dataAccuracyConfirmed ? 'Yes' : 'No'}</p>
        <p><strong>Ownership Confirmed:</strong> ${formData.ownershipConfirmed ? 'Yes' : 'No'}</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
        <p style="font-weight: bold; color: red;">ACTION REQUIRED:</p>
        <p>
          Please review and approve this registration in your admin panel:
          <a 
            href="https://chipthem.com/admin/verifications/petOwner" 
            target="_blank" 
            style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >
            Go to Pet Owner Verifications
          </a>
        </p>
      </div>
    `;

    await sendEmail({
      to: "info@chipthem.com",
      subject: `🚨 New Pet Microchip Registration: ${formData.petName} (${formData.microchipNumber})`,
      html: adminHtml,
    });

    // --- 7. SEND USER CONFIRMATION EMAIL ---
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
        <h2>🐾 Thank you for registering with ChipThem, ${formData.fullName}!</h2>
        <p>We've received your registration for <strong>${formData.petName}</strong>.</p>
        <p><strong>Microchip Number:</strong> ${formData.microchipNumber}</p>
        <p>Your submission is currently <strong>pending verification</strong> by our admin team.
        Once verified, you'll receive a confirmation email and your pet's registration will become active.</p>
        <p>This review process typically takes <strong>24–48 hours</strong>.</p>
        <br/>
        <p>If any additional information is needed, we'll contact you at <strong>${formData.email}</strong>.</p>
        <p>Thank you for helping us ensure the safety and lifelong protection of all pets!</p>
        <br/>
        <p>Warm regards,<br/><strong>The ChipThem Verification Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: formData.email,
      subject: "Welcome to ChipThem - Pet Registration Successful",
      html: emailHtml,
    });

    console.log("✅ Pet registration successful:", formData.email);

    return NextResponse.json({
      success: true,
      message: "Pet registration successful! A confirmation email has been sent.",
    });

  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Registration error:", err.message);
    } else {
      console.error("❌ Registration error:", err);
    }
    return NextResponse.json(
      { success: false, message: "Internal server error: A critical error occurred during registration." },
      { status: 500 }
    );
  }
}
