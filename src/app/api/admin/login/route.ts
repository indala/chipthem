import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { supabaseServerClient } from "@/lib/supabaseServerClient";


// --- JWT setup ---
if (!process.env.JWT_SECRET) {
 throw new Error("FATAL ERROR: JWT_SECRET environment variable is not set.");
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET);


export async function POST(req: Request) {
 const INVALID_CREDENTIALS_RESPONSE = NextResponse.json(
  { success: false, error: "Invalid credentials" },
  { status: 401 }
 );


 try {
  const { username, password } = await req.json();


  if (!username || !password) {
   return NextResponse.json(
    { success: false, error: "Username and password required" },
    { status: 400 }
   );
  }


  // Fetch admin
  const { data } = await supabaseServerClient
   .from("admins")
   .select("id, username, password_hash")
   .eq("username", username)
   .single();


  if (!data) return INVALID_CREDENTIALS_RESPONSE;


  // Verify password
  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) return INVALID_CREDENTIALS_RESPONSE;


  // Create JWT
  const token = await new jose.SignJWT({
   id: data.id,
   username: data.username,
   role: "admin",
  })
   .setProtectedHeader({ alg: "HS256" })
   .setIssuedAt()
   .setExpirationTime("7d")
   .sign(secret);


  // Create response (no sensitive data)
  const res = new NextResponse(null, { status: 204 }); // 204 = No Content


  // Set secure cookie
  res.cookies.set("admin_token", token, {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production",
   sameSite: "lax",
   path: "/",
   maxAge: 60 * 60 * 24 * 7,
  });


  return res;
 } catch (err) {
  console.error("Login error:", err);
  return NextResponse.json(
   { success: false, error: "Server error" },
   { status: 500 }
  );
 }
}