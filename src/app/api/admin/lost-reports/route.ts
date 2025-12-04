import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { verifyTokenAndGetPayload } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await verifyTokenAndGetPayload();

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseServerClient
      .from("lost_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ reports: data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("Unauthorized")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    console.error("❌ Error fetching lost pet reports:", errorMessage);

    return NextResponse.json(
      { message: `Failed to fetch lost pet reports: ${errorMessage}` },
      { status: 500 }
    );
  }
}
