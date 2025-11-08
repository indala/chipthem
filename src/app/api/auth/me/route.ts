
import { NextResponse } from "next/server";
import { verifyTokenAndGetPayload } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await verifyTokenAndGetPayload();

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    return NextResponse.json({ user: payload, success: true });
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
