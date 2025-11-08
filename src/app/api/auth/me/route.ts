import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ Await required in Next.js 15+

    // Check for all possible tokens
    const adminToken = cookieStore.get("admin_token")?.value;
    const vetToken = cookieStore.get("veterinary_token")?.value;
    const petOwnerToken = cookieStore.get("petOwner_token")?.value;

    const token = adminToken || vetToken || petOwnerToken;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    // Verify JWT using JOSE
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // Payload may contain user info like { id, email, role, ... }
    return NextResponse.json({ user: payload,success:true });
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
