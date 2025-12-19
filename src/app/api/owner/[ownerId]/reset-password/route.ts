// app/api/owner/[ownerId]/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import bcrypt from 'bcryptjs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
    const { ownerId } = await params;

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID required' },
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

    // 1) Fetch owner with password_hash
    const { data: owner, error: fetchError } = await supabaseServerClient
      .from('owners')
      .select('password_hash')
      .eq('id', ownerId)
      .single();

    if (fetchError || !owner) {
      console.error('Owner fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    // 2) Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      owner.password_hash
    );

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
      .from('owners')
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ownerId);

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password API error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
