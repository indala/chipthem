// /api/admin/users/route.ts
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { Pet, Owner } from "@/types/owners";
import { VeterinaryClinic } from "@/types/veterinaries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search")?.trim() || "";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let petOwners: (Owner & { pets: Pet[] })[] = [];
    let veterinaries: VeterinaryClinic[] = [];

    // -------------------------------------------------
    // 1️⃣ FETCH ONLY VERIFIED PET OWNERS
    // -------------------------------------------------
    if (type === "owners" || type === "all") {
      let query = supabaseServerClient
        .from("owners")
        .select(
          `
          id,
          full_name,
          email,
          phone_number,
          street_address,
          city,
          country,
          is_verified,
          status,
          created_at,
          pets (
            id,
            pet_name,
            pet_type,
            breed,
            sex,
            primary_color,
            is_verified,
            status,
            microchip_number,
            subscription_status,
            subscribed_at,
            subscription_expires_at,
            verified_at
          )
          `,
          { count: "exact" }
        )
        .eq("is_verified", true)     // ← ONLY VERIFIED OWNERS
        .range(from, to);

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter only verified pets
      const cleaned = (data as (Owner & { pets: Pet[] })[]).map((o) => ({
        ...o,
        pets: o.pets.filter((p) => p.is_verified === true),
      }));

      petOwners = cleaned;
    }

    // -------------------------------------------------
    // 2️⃣ FETCH ONLY VERIFIED VETERINARY CLINICS
    // -------------------------------------------------
    if (type === "veterinarians" || type === "veterinaries" || type === "all") {
      let query = supabaseServerClient
        .from("veterinary_clinics")
        .select(
          `
          id,
          clinic_name,
          contact_person,
          email,
          phone,
          alt_phone,
          website,
          license_number,
          years_in_practice,
          specializations,
          additional_services,
          microchip_services,
          has_microchip_scanners,
          scanner_types,
          street_address,
          city,
          state_province,
          postal_code,
          country,
          operating_hours,
          provides_24h_emergency,
          terms_accepted,
          data_accuracy_confirmed,
          professional_confirmation,
          consent_for_referrals,
          email_updates_opt_in,
          is_verified,
          status,
          created_at,
          updated_at,
          verified_at,
          subscription_status,
          subscribed_at,
          subscription_expires_at
          `,
          { count: "exact" }
        )
        .eq("is_verified", true)     // ← ONLY VERIFIED CLINICS
        .range(from, to);

      if (search) {
        query = query.or(
          `clinic_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      veterinaries = data as VeterinaryClinic[];
    }

    // -------------------------------------------------

    return NextResponse.json({
      success: true,
      page,
      limit,
      petOwners,
      veterinaries,
      hasMore: petOwners.length === limit || veterinaries.length === limit,
    });

  } catch (err) {
    console.error("❌ Fetch paginated users failed:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
