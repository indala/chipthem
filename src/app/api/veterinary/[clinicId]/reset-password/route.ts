// app/api/veterinary/[clinicId]/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import bcrypt from 'bcryptjs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clinicId: string }> }
) {
  try {
    const { clinicId } =await params;

    if (!clinicId) {
      return NextResponse.json(
        { error: 'Veterinary ID required' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // 1) Fetch veterinary clinic with password_hash
    const { data: clinic, error: fetchError } = await supabaseServerClient
      .from('veterinary_clinics')
      .select('password_hash')
      .eq('id', clinicId)
      .single();

    if (fetchError || !clinic) {
      console.error('Veterinary fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Veterinary clinic not found' },
        { status: 404 }
      );
    }

    // 2) Verify current password
    const isMatch = await bcrypt.compare(currentPassword, clinic.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Incorrect current password' },
        { status: 401 }
      );
    }

    // 3) Hash new password
    const newHash = await bcrypt.hash(newPassword, 12);

    // 4) Update password_hash
    const { error: updateError } = await supabaseServerClient
      .from('veterinary_clinics')
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', clinicId);

    if (updateError) {
      console.error('Veterinary password update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Veterinary reset password API error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
