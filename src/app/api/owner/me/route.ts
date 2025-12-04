
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { verifyTokenAndGetPayload } from '@/lib/auth';

// This route handler is responsible for fetching data for the currently authenticated owner.
// It uses our centralized auth function to identify the user and then fetches their data.
export async function GET() {
  try {
    // 1. Verify the token and get the user's payload
    const payload = await verifyTokenAndGetPayload();

    // 2. Ensure the user is a pet owner and has a valid session
    if (!payload || payload.role !== 'petOwner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The user's ID is in the 'sub' claim of the JWT payload
    const userId = payload.id;

    // 3. Fetch the owner's profile using the authenticated user's ID.
    const { data: ownerData, error: ownerError } = await supabaseServerClient
      .from('owners')
      .select('*')
      .eq('id', userId)
      .single();

    if (ownerError || !ownerData) {
      console.error('API owner fetch error:', ownerError);
      return NextResponse.json({ error: 'Owner profile not found.' }, { status: 404 });
    }

    // 4. Fetch all pets associated with this owner's ID.
    const { data: petsData, error: petsError } = await supabaseServerClient
      .from('pets')
      .select('*')
      .eq('owner_id', ownerData.id);

    if (petsError) {
      console.error('API pets fetch error:', petsError);
      return NextResponse.json({ error: 'Failed to fetch pets.' }, { status: 500 });
    }

    // 5. Return the combined owner and pets data.
    return NextResponse.json({ owner: ownerData, pets: petsData || [] });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
