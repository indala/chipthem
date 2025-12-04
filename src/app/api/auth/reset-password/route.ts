import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { ROLE_TABLES } from "@/lib/ROLE_TABLES";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Verify JWT token
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const { userId, role } = payload as { userId: string; role: string };

    // Get table & column config based on role
    const roleConfig = ROLE_TABLES[role as keyof typeof ROLE_TABLES];
    if (!roleConfig) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    const { error } = await supabaseServerClient
      .from(roleConfig.table)
      .update({ [roleConfig.passwordCol]: hashedPassword })
      .eq(roleConfig.idCol, userId);

    if (error) {
      console.error("DB update error:", error);
      return NextResponse.json(
        { message: "Failed to reset password" },
        { status: 500 }
      );
    }

    // ✅ Send role back so frontend can redirect
    return NextResponse.json({
      message: "Password reset successfully",
      role, // <-- important
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
