import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = supabaseServerClient;

  if (!id) {
    return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("found_reports")
      .update({ status: "resolved" })
      .eq("id", id);

    if (error) {
      console.error("Error resolving found report:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Report resolved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error in PATCH /api/admin/found-reports/[id]/resolve:",
      error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
