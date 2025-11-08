
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { verifyTokenAndGetPayload } from "@/lib/auth"; // Correctly import the unified function

export async function GET(req: Request) {
  // 1. Use the new centralized verification function
  const payload = await verifyTokenAndGetPayload();

  // 2. Check for authorization
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch pets that are pending or not verified, along with their owners
    const { data, error, count } = await supabaseServerClient
      .from("pets")
      .select(
        `
        *,
        owner:owners(*)
      `,
        { count: "exact" }
      )
      .or("is_verified.eq.false,status.eq.pending") // filter
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching pending pets with owners:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch pending pets." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pets: data,
      pagination: {
        currentPage: page,
        totalPets: count || 0,
        hasMore: count ? to + 1 < count : false,
      },
    });
  } catch (err) {
    console.error("GET pending pets error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
