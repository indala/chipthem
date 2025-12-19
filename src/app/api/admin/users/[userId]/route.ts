import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServerClient";

type IdRecord = { id: string };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const supabase = supabaseServerClient;
  const { userId } = await params;

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------------------------
    // 1️⃣ Check if the email exists in ANY table and belongs to a different user
    // ---------------------------------------------------------------------------

    const checkTables = ["owners", "veterinary_clinics", "admins"] as const;

    for (const table of checkTables) {
      const { data } = await supabase
        .from(table)
        .select("id")
        .eq("email", email)
        .single<IdRecord>(); // Typed output

      if (data && data.id !== userId) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 409 }
        );
      }
    }

    // ---------------------------------------------------------------------------
    // 2️⃣ Determine which table the user belongs to and update the email
    // ---------------------------------------------------------------------------

    // Check Owner
    const { data: owner } = await supabase
      .from("owners")
      .select("id")
      .eq("id", userId)
      .single<IdRecord>();

    if (owner) {
      const { error } = await supabase
        .from("owners")
        .update({ email })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Check Veterinary Clinic
    const { data: vet } = await supabase
      .from("veterinary_clinics")
      .select("id")
      .eq("id", userId)
      .single<IdRecord>();

    if (vet) {
      const { error } = await supabase
        .from("veterinary_clinics")
        .update({ email })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Check Admin
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("id", userId)
      .single<IdRecord>();

    if (admin) {
      const { error } = await supabase
        .from("admins")
        .update({ email })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ---------------------------------------------------------------------------
    // 3️⃣ No user found at all
    // ---------------------------------------------------------------------------
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );

  } catch (err) {
    console.error("❌ Email update error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
