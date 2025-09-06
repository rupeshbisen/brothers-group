import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

// GET - Fetch all admin users (Super Admin only)
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

    // Check if super admin
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json(
        { error: "Access denied. Only super admin can view all admins." },
        { status: 403 }
      );
    }

    // Use admin client to bypass RLS for fetching all admin profiles
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase
      .from("admin_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get admins error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add new admin user (Super Admin only)
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

    const adminData = await request.json();

    // Check if super admin only
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      return NextResponse.json(
        { error: "Failed to verify admin permissions" },
        { status: 500 }
      );
    }

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json(
        { error: "Access denied. Only super admin can add new admins." },
        { status: 403 }
      );
    }

    // Validate required fields
    const requiredFields = ["email", "password", "name", "role"];
    for (const field of requiredFields) {
      if (!adminData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate role
    const validRoles = ["super_admin", "admin"];
    if (!validRoles.includes(adminData.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: super_admin, admin" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth using admin client
    const adminSupabase = await createAdminClient();
    const { data: authData, error: authError2 } =
      await adminSupabase.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true,
      });

    if (authError2) {
      return NextResponse.json(
        { error: `Auth error: ${authError2.message}` },
        { status: 500 }
      );
    }

    // Check if this is the first admin user
    const { data: existingAdmins } = await adminSupabase
      .from("admin_profiles")
      .select("id")
      .limit(1);

    // Create admin profile using admin client to bypass RLS
    const { data, error } = await adminSupabase
      .from("admin_profiles")
      .insert([
        {
          user_id: authData.user.id,
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone || null,
          role: adminData.role,
          created_by:
            existingAdmins && existingAdmins.length > 0 ? profile.id : null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // If profile creation fails, delete the auth user
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Add admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
