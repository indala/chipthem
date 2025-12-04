import { NextResponse } from "next/server";
import * as jose from "jose";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { ROLE_TABLES } from "@/lib/ROLE_TABLES";
import { sendEmail } from "@/utils/sendEmail";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Type-Safe Definition to handle the dynamic ID column returned by Supabase.
 * It ensures we have an 'email' and allows for a dynamically named string key
 * (the user ID column) whose value is expected to be a string or number.
 */
type UserRecord = {
  email: string;
  [key: string]: string | number | boolean | null | undefined; 
};

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const roleConfig = ROLE_TABLES[role as keyof typeof ROLE_TABLES];
    if (!roleConfig) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Find user
    const { data: user, error } = await supabaseServerClient
      .from(roleConfig.table)
      .select(`${roleConfig.idCol}, email`)
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    // Assert the result to our type-safe UserRecord to allow dynamic indexing
    const typedUser = user as UserRecord | null;

    if (error || !typedUser) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    // Create JWT valid for 15 minutes
    const token = await new jose.SignJWT({
      // FIXED: Using typedUser and string indexing is now type-safe
      userId: typedUser[roleConfig.idCol],
      role,
      email: typedUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(JWT_SECRET);

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Send email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetUrl}" target="_blank">Reset Password</a>
             <p>This link will expire in 15 minutes.</p>`,
    });

    return NextResponse.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}