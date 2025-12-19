// app/api/owner/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
    const { ownerId } = await params;
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID required' }, { status: 400 });
    }

    const data = await request.json();

    const { data: updatedOwner, error: updateError } = await supabaseServerClient
      .from('owners')
      .update({
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        street_address: data.street_address,
        city: data.city,
        country: data.country,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ownerId)
      .select()
      .single();

    if (updateError || !updatedOwner) {
      console.error('Owner update error:', updateError);
      return NextResponse.json({ error: 'Failed to update owner' }, { status: 500 });
    }

    return NextResponse.json({ owner: updatedOwner });

  } catch (error) {
    console.error('Owner update API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
