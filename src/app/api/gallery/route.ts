import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// GET - Fetch gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type"); // 'image' or 'video'
    const status = searchParams.get("status"); // 'approved' or 'pending'

    // Use admin client to bypass RLS policies for admin access
    const supabase = await createAdminClient();

    let query = supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (type) {
      query = query.eq("file_type", type);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    } else if (!status) {
      // By default, only show approved items for public access
      query = query.eq("status", "approved");
    }
    // If status is 'all', don't filter by status

    const { data, error } = await query;

    if (error) {
      console.error("Gallery API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data });
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Upload new gallery item (Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

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
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "super_admin" && profile.role !== "content_admin")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const itemData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "file_url",
      "type",
      "category",
    ];
    for (const field of requiredFields) {
      if (!itemData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("gallery")
      .insert([
        {
          ...itemData,
          status: "approved", // Admin uploads are auto-approved
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
    console.error("Create gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
