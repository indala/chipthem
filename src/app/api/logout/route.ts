import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });

  const cookieOptions = {
    httpOnly: true,
    secure: true, // ✅ Required on production
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  ['admin_token', 'veterinary_token', 'petOwner_token'].forEach(name => {
    res.cookies.set(name, '', cookieOptions);
  });

  return res;
}
