import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// GET - Fetch announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'general', 'event', 'important'
    const isActive = searchParams.get("isActive"); // 'true' or 'false'

    const supabase = await createClient();

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let isAdmin = false;

    if (user) {
      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      isAdmin =
        !!profile &&
        (profile.role === "super_admin" || profile.role === "content_admin");
    }

    let query = supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    // If admin and no specific filter, show all announcements
    if (isAdmin && isActive === null) {
      // Don't filter by status - show all announcements
    } else if (isActive !== null) {
      query = query.eq("status", isActive === "true" ? "active" : "inactive");
    } else {
      // By default, only show active announcements for public access
      query = query.eq("status", "active");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get announcements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new announcement (Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "super_admin" && profile.role !== "content_admin")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const announcementData = await request.json();

    // Validate required fields
    const requiredFields = ["title", "content", "type"];
    for (const field of requiredFields) {
      if (!announcementData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate type
    const validTypes = ["general", "event", "donation", "urgent"];
    if (!validTypes.includes(announcementData.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid type. Must be one of: general, event, donation, urgent",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert([
        {
          ...announcementData,
          created_by: profile.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
