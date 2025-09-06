import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// PUT - Update banner (Admin only)
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

    const { data, error } = await supabase
      .from("banners")
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
    console.error("Update banner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner (Admin only)
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

    // First, get the banner to extract the ImageKit file ID for deletion
    const { data: banner, error: fetchError } = await supabase
      .from("banners")
      .select("image_url, imagekit_file_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Delete file from ImageKit using stored file ID
    if (banner.imagekit_file_id) {
      try {
        const imagekitApiUrl = process.env.IMAGEKIT_API_URL;
        if (!imagekitApiUrl) {
          return NextResponse.json(
            { error: "ImageKit API URL is not configured" },
            { status: 500 }
          );
        }
        const deleteResponse = await fetch(
          `${imagekitApiUrl}/${banner.imagekit_file_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${Buffer.from(
                process.env.IMAGEKIT_PRIVATE_KEY + ":"
              ).toString("base64")}`,
            },
          }
        );

        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text();
          console.warn(
            "Failed to delete file from ImageKit:",
            banner.imagekit_file_id,
            "Status:",
            deleteResponse.status,
            "Error:",
            errorText
          );
        }
      } catch (deleteError) {
        console.warn("Error deleting file from ImageKit:", deleteError);
      }
    } else {
      console.warn("No ImageKit file ID found for banner:", id);
    }

    // Delete banner from database
    const { error } = await supabase.from("banners").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
