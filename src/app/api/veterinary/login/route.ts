import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

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


    // 2️⃣ Fetch clinic from DB (no status)
    const { data: clinic, error } = await supabaseServerClient
      .from("veterinary_clinics")
      .select("id, email, clinic_name, password_hash, is_verified")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Veterinary DB fetch error:", error);
      return new NextResponse(null, { status: 500 });
    }

    if (!clinic) {
      return new NextResponse(null, { status: 404 }); // Not found
    }

    // 3️⃣ Check verification only
    if (!clinic.is_verified) {
      return new NextResponse(null, { status: 403 }); // Not verified
    }

    // 4️⃣ Validate password
    const validPassword = await bcrypt.compare(password, clinic.password_hash);
    if (!validPassword) {
      return new NextResponse(null, { status: 401 }); // Wrong password
    }

    // 5️⃣ Create JWT token
    const token = await new jose.SignJWT({
      role: "veterinary",
      id: clinic.id,
      email: clinic.email,

    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // 6️⃣ Send token in secure cookie (no JSON)
    const response = new NextResponse(null, { status: 204 });
    response.cookies.set("veterinary_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Veterinary login:", clinic.email);
    return response;
  } catch (err) {
    console.error("❌ Veterinary login error:", err);
    return new NextResponse(null, { status: 500 });
  }
}
