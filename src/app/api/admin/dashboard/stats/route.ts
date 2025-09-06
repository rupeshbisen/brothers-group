import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Get total events
    const { count: totalEvents } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    // Get total gallery items
    const { count: totalGalleryItems } = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true });

    // Get pending uploads
    const { count: pendingUploads } = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Get unread contacts
    const { count: unreadContacts } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");

    return NextResponse.json({
      totalEvents: totalEvents || 0,
      totalGalleryItems: totalGalleryItems || 0,
      pendingUploads: pendingUploads || 0,
      unreadContacts: unreadContacts || 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
