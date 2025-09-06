import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

// GET - Fetch single admin user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        { error: "Access denied. Only super admin can view admin details." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        { error: "Access denied. Only super admin can update admin users." },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "role"];
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate role
    const validRoles = ["super_admin", "admin"];
    if (!validRoles.includes(updateData.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: super_admin, admin" },
        { status: 400 }
      );
    }

    // Get the admin profile to find the user_id
    const { data: existingAdmin } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existingAdmin) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Update admin profile using admin client to bypass RLS
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase
      .from("admin_profiles")
      .update({
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone || null,
        role: updateData.role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        { error: "Access denied. Only super admin can delete admin users." },
        { status: 403 }
      );
    }

    // Get the admin profile to find the user_id
    const { data: existingAdmin } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existingAdmin) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Prevent deleting self
    if (existingAdmin.user_id === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete admin profile first using admin client to bypass RLS
    const adminSupabase = await createAdminClient();
    const { error: profileError } = await adminSupabase
      .from("admin_profiles")
      .delete()
      .eq("id", id);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // Delete auth user using admin client
    const { error: authError2 } = await adminSupabase.auth.admin.deleteUser(
      existingAdmin.user_id
    );

    if (authError2) {
      console.error("Error deleting auth user:", authError2);
      // Note: We don't return error here as the profile is already deleted
    }

    return NextResponse.json({ message: "Admin user deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
