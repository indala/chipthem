import { supabaseServerClient } from "@/lib/supabaseServerClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = supabaseServerClient;

    const [
      owners,
      vets,
      pets,
      pendingOwners,
      pendingVets,
      lost,
      found
    ] = await Promise.all([
      supabase
        .from("owners")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("veterinary_clinics") // <-- FIX: correct table name
        .select("*", { count: "exact", head: true }),

      supabase
        .from("pets")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("owners")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", false),

      supabase
        .from("veterinary_clinics")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", false),

      supabase
        .from("lost_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "unresolved"),


      supabase
        .from("found_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "unresolved"),

    ]);

    return NextResponse.json({
      stats: {
        totalOwners: owners.count || 0,
        totalVeterinaries: vets.count || 0,
        totalPets: pets.count || 0,
        pendingOwnerVerifications: pendingOwners.count || 0,
        pendingVetVerifications: pendingVets.count || 0,
        lostReports: lost.count || 0,
        foundReports: found.count || 0,
      },
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
