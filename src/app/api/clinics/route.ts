// app/api/clinics/route.ts
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';

// -----------------------------
// Database row shape
// -----------------------------
interface ClinicDBData {
  id: string;
  clinic_name: string;
  phone: string | null;
  website: string | null;
  google_maps_url: string | null;
  operating_hours: string | null;
  street_address: string | null;
  city: string | null;
  state_province: string | null;
  country: string | null;
  latitude: string;   // ← enforce non-null after filters
  longitude: string;  // ← enforce non-null after filters
  specializations: string[] | null;
  additional_services: string[] | null;
  microchip_services: boolean;
  provides_24h_emergency: boolean;
}

// -----------------------------
// Public API response shape
// -----------------------------
interface ClinicPublicData {
  id: string;
  name: string;
  website: string | null;
  google_maps_url: string | null;
  address: string;
  city: string | null;
  state_province: string | null;
  phone: string | null;
  hours: string | null;
  lat: number;
  lng: number;
  services: string[];
  is_24h: boolean;
}

export async function GET() {
  try {
    const { data, error } = await supabaseServerClient
      .from('veterinary_clinics')
      .select(
        `
        id,
        clinic_name,
        phone,
        website,
        google_maps_url,
        operating_hours,
        street_address,
        city,
        state_province,
        country,
        latitude,
        longitude,
        specializations,
        additional_services,
        microchip_services,
        provides_24h_emergency
      `
      )
      .eq('is_verified', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(100);

    if (error) {
      console.error('❌ Public clinic fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve clinic data' },
        { status: 500 }
      );
    }

    const publicClinics: ClinicPublicData[] = (data as ClinicDBData[]).map(
      (clinic) => {
        // Combine address safely
        const address = [
          clinic.street_address,
          clinic.city,
          clinic.state_province,
          clinic.country,
        ]
          .filter((p): p is string => Boolean(p && p.trim()))
          .join(', ');

        // Merge services cleanly
        const services: string[] = [
          ...(clinic.specializations ?? []),
          ...(clinic.additional_services ?? []),
          clinic.microchip_services ? 'Microchipping' : null,
        ].filter((s): s is string => Boolean(s));

        return {
          id: clinic.id,
          name: clinic.clinic_name,
          website: clinic.website,
          google_maps_url: clinic.google_maps_url,
          address,
          city: clinic.city,
          state_province: clinic.state_province,
          phone: clinic.phone,
          hours: clinic.operating_hours,
          lat: Number(clinic.latitude),
          lng: Number(clinic.longitude),
          services,
          is_24h: clinic.provides_24h_emergency,
        };
      }
    );

    return NextResponse.json(publicClinics);
  } catch (err) {
    console.error('❌ Clinics API route crash:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
