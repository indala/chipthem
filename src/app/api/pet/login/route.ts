import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import bcrypt from "bcryptjs";
import * as jose from "jose";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not set in environment variables.");
const secret = new TextEncoder().encode(jwtSecret);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Validate input
    if (!email || !password) {
      return new NextResponse(null, { status: 400 });
    }

    // 2️⃣ Fetch owner from DB
    const { data: owner, error } = await supabaseServerClient
      .from("owners")
      .select("id, email, password_hash, full_name, is_verified, verified_at")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Database fetch error:", error);
      return new NextResponse(null, { status: 500 });
    }

    if (!owner) {
      return new NextResponse(null, { status: 404 }); // Not found
    }

    // 3️⃣ Check verification status
    if (!owner.is_verified) {
      return new NextResponse(null, { status: 403 }); // Not verified
    }

    // 4️⃣ Compare password
    const validPassword = await bcrypt.compare(password, owner.password_hash);
    if (!validPassword) {
      return new NextResponse(null, { status: 401 }); // Wrong password
    }

    // 5️⃣ Create JWT Token
    const token = await new jose.SignJWT({
      role: "petOwner",
      id: owner.id,
      email: owner.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // 6️⃣ Send token in secure cookie (no JSON)
    const response = new NextResponse(null, { status: 204 });
    response.cookies.set("petOwner_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("✅ Pet Owner login:", owner.email);
    return response;
  } catch (err) {
    console.error("❌ Login error:", err);
    return new NextResponse(null, { status: 500 });
  }
}
