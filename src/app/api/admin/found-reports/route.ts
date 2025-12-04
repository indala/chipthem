import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { verifyTokenAndGetPayload } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Use the new centralized verification function
    const payload = await verifyTokenAndGetPayload();

    // 2. Check for authorization
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3. Fetch data if authorized
    const { data, error } = await supabaseServerClient
      .from("found_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ reports: data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Distinguish between auth errors and other errors
    if (errorMessage.includes("Unauthorized")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    console.error("❌ Error fetching found pet reports:", errorMessage);

    return NextResponse.json(
      { message: `Failed to fetch found pet reports: ${errorMessage}` },
      { status: 500 }
    );
  }
}
