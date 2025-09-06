import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// PUT - Update contact submission status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "super_admin" && profile.role !== "content_admin")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updateData = await request.json();
    const { id } = await params;

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ["unread", "read", "replied", "resolved"];
      if (!validStatuses.includes(updateData.status)) {
        return NextResponse.json(
          {
            error:
              "Invalid status. Must be one of: unread, read, replied, resolved",
          },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("contact_submissions")
      .update({
        ...updateData,
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
    console.error("Update contact submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact submission (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "super_admin" && profile.role !== "content_admin")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Contact submission deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
