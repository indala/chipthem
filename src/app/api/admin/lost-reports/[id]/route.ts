import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = supabaseServerClient;

  if (!id) {
    return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
  }

  try {
    // 1️⃣ Fetch the report to get the pet_photo URL
    const { data: report, error: fetchError } = await supabase
      .from("lost_reports")
      .select("pet_photo")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching lost report to delete:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 2️⃣ If there's a photo, delete it from Supabase Storage
    if (report?.pet_photo) {
      try {
        const photoPath = new URL(report.pet_photo).pathname.split("/pet_photos/")[1];
        if (photoPath) {
          const { error: storageError } = await supabase.storage
            .from("pet_photos")
            .remove([photoPath]);

          if (storageError) {
            console.error("Error deleting photo from storage:", storageError);
          }
        }
      } catch (e) {
        console.error("Invalid pet_photo URL:", e);
      }
    }

    // 3️⃣ Delete the report from the database
    const { error: deleteError } = await supabase
      .from("lost_reports")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting lost report from database:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Lost report deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/admin/lost-reports/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
