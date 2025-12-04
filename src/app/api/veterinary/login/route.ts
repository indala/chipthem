import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function POST(req: Request) {
  try {
    const { clinic_id, username, password } = await req.json();

    // 1️⃣ Basic validation
    if (!clinic_id || !username || !password) {
      return new NextResponse(null, { status: 400 });
    }

    // 2️⃣ Find the clinic
    const { data: clinic, error } = await supabaseServerClient
      .from("veterinary_clinics")
      .select("clinic_id, email, clinic_name, password_hash, is_verified, status")
      .eq("clinic_id", clinic_id)
      .eq("email", username)
      .single();

    if (error || !clinic) {
      return new NextResponse(null, { status: 401 }); // invalid credentials
    }

    // 3️⃣ Check verification status
    if (!clinic.is_verified || clinic.status !== "approved") {
      return new NextResponse(null, { status: 403 }); // not verified/approved
    }

    // 4️⃣ Validate password
    const validPassword = await bcrypt.compare(password, clinic.password_hash);
    if (!validPassword) {
      return new NextResponse(null, { status: 401 });
    }

    // 5️⃣ Generate JWT
    const token = await new jose.SignJWT({
      role: "veterinary",
      email: clinic.email,
      id: clinic.clinic_id,
      clinic_name: clinic.clinic_name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // 6️⃣ Create a blank response (no JSON sent to client)
    const response = new NextResponse(null, { status: 204 });

    // 7️⃣ Set secure cookie
    response.cookies.set("veterinary_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Veterinary login error:", err);
    return new NextResponse(null, { status: 500 });
  }
}
