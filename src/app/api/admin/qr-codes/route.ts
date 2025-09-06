import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

// GET - Fetch all QR codes
export async function GET() {
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

    // Check if admin
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Fetch QR codes
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get QR codes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new QR code
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

    const qrData = await request.json();

    // Check if admin
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    if (
      profileError ||
      !profile ||
      !["admin", "super_admin"].includes(profile.role)
    ) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Validate required fields
    const requiredFields = ["title", "url"];
    for (const field of requiredFields) {
      if (!qrData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate URL format
    try {
      new URL(qrData.url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Validate size and margin
    const size = qrData.size || 256;
    const margin = qrData.margin || 2;

    if (size < 64 || size > 1024) {
      return NextResponse.json(
        { error: "Size must be between 64 and 1024" },
        { status: 400 }
      );
    }

    if (margin < 0 || margin > 10) {
      return NextResponse.json(
        { error: "Margin must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Create QR code using admin client to bypass RLS
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase
      .from("qr_codes")
      .insert([
        {
          title: qrData.title,
          description: qrData.description || null,
          url: qrData.url,
          size,
          margin,
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
    console.error("Create QR code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
