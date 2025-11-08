
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { verifyTokenAndGetPayload } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = await verifyTokenAndGetPayload();

    if (!payload || payload.role !== 'veterinary') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = payload.sub;

    const { data: veterinaryData, error: veterinaryError } = await supabaseServerClient
      .from('veterinary_clinics')
      .select('*')
      .eq('id', userId)
      .single();

    if (veterinaryError || !veterinaryData) {
      console.error('API veterinary fetch error:', veterinaryError);
      return NextResponse.json({ error: 'Veterinary profile not found.' }, { status: 404 });
    }

    return NextResponse.json({ veterinary: veterinaryData });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
