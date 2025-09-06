import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // 'upcoming' or 'past'
    const category = searchParams.get("category");

    const supabase = await createClient();

    let query = supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (status) {
      const today = new Date().toISOString().split("T")[0];
      if (status === "upcoming") {
        query = query.gte("date", today);
      } else if (status === "past") {
        query = query.lt("date", today);
      }
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new event (Admin only)
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

    // Check admin role and get profile ID
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

    const eventData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "date",
      "time",
      "location",
      "description",
      "category",
    ];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          category: eventData.category,
          created_by: profile.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
