import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Get recent donations (last 5, ordered by creation date)
    const { data: recentDonations, error } = await supabase
      .from("donations")
      .select("id, donor_name, amount, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    return NextResponse.json(recentDonations || []);
  } catch (error) {
    console.error("Recent donations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent donations" },
      { status: 500 }
    );
  }
}
