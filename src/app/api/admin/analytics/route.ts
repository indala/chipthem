import { supabaseServerClient } from '@/lib/supabaseServerClient';

export async function GET() {
  const supabase = supabaseServerClient;

  /** 1. Pets Analytics */
  const pets = await supabase
    .from('pets')
    .select('pet_type, primary_color, is_verified, created_at');

  /** 2. Lost Reports (no id, include status) */
  const lost = await supabase
    .from('lost_reports')
    .select('pet_type, color, created_at, last_seen_location, status');

  /** 3. Found Reports (no id, include status) */
  const found = await supabase
    .from('found_reports')
    .select('pet_type, color, created_at, found_location, status');

  /** 4. Owners Analytics */
  const owners = await supabase
    .from('owners')
    .select('city, country, is_verified, created_at');

  /** 5. Veterinary Clinics Analytics */
  const vets = await supabase
    .from('veterinary_clinics')
    .select(
      'city, state_province, is_verified, created_at, microchip_services'
    );

  return Response.json({
    pets: pets.data || [],
    lostReports: lost.data || [],
    foundReports: found.data || [],
    owners: owners.data || [],
    vets: vets.data || []
  });
}
