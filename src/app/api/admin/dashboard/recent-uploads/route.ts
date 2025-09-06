import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Get recent uploads (last 5, ordered by creation date)
    const { data: recentUploads, error } = await supabase
      .from("gallery")
      .select("id, title, uploader_name, created_at, file_type, status")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    return NextResponse.json(recentUploads || []);
  } catch (error) {
    console.error("Recent uploads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent uploads" },
      { status: 500 }
    );
  }
}
