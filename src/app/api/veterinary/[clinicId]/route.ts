// app/api/veterinary/[clinicId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import type { VeterinaryClinic } from '@/types/veterinaries';

// Type alias for convenience
type VeterinaryUpdatePayload = Partial<VeterinaryClinic>;

// Use the full VeterinaryClinic type for the keys array
const ALLOWED_KEYS: (keyof VeterinaryClinic)[] = [
    'clinic_name',
    'contact_person',
    'phone',
    'alt_phone',
    'website',
    'license_number',
    'years_in_practice',
    'specializations',
    'additional_services',
    'microchip_services',
    'has_microchip_scanners',
    'scanner_types',
    'street_address',
    'city',
    'state_province',
    'postal_code',
    'country',
    'operating_hours',
    'provides_24h_emergency',
    'terms_accepted',
    'data_accuracy_confirmed',
    'professional_confirmation',
    'consent_for_referrals',
    'email_updates_opt_in',
    'google_maps_url',
    'latitude',
    'longitude',
];

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ clinicId: string }> }
) {
    try {
        const { clinicId } = await params;

        const body: VeterinaryUpdatePayload = await request.json();

        // FIX 1: Use Record<string, unknown> (or Record<string, any> if you prefer a slightly weaker type)
        // to define the object where we will dynamically add keys. This allows indexing by 'key'.
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        for (const key of ALLOWED_KEYS) {
            // FIX 2: Check for presence of the key in body
            if (Object.prototype.hasOwnProperty.call(body, key)) {
                
                // FIX 3: Assign the value. We must cast 'key' to use it on the body object.
                // TypeScript can't infer that 'key' (from ALLOWED_KEYS) is a valid key
                // of the 'body' (which is Partial<VeterinaryClinic>), so we cast it.
                const bodyKey = key as keyof VeterinaryUpdatePayload;
                updateData[key] = body[bodyKey];
            }
        }

        // FIX 4: Define the exact type we want and cast the constructed object to it.
        const finalUpdatePayload = updateData as VeterinaryUpdatePayload & { updated_at: string };

        const { error } = await supabaseServerClient
            .from('veterinary_clinics')
            .update(finalUpdatePayload)
            .eq('id', clinicId);

        if (error) {
            console.error('Vet update error:', error);
            return NextResponse.json(
                { error: 'Failed to update veterinary clinic' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Vet PATCH route error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}