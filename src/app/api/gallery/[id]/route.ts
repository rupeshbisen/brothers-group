import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { deleteImageKitFile } from "@/lib/imagekit";

// GET - Fetch single gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update gallery item (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await createAdminClient();
    const updateData = await request.json();
    const { id } = await params;

    // If approved_by is provided, validate it exists in admin_profiles
    if (updateData.approved_by) {
      const { data: adminProfile, error: adminError } = await supabase
        .from("admin_profiles")
        .select("id")
        .eq("id", updateData.approved_by)
        .single();

      if (adminError || !adminProfile) {
        console.error("Invalid admin ID:", updateData.approved_by);
        // Remove approved_by if it's invalid, but still allow the update
        delete updateData.approved_by;
      }
    }

    // If status is being set to 'rejected', clean up the storage
    let fileIdToDelete: string | null = null;
    if (updateData.status === "rejected") {
      // Get the current file info before updating
      const { data: currentItem } = await supabase
        .from("gallery")
        .select("file_url, imagekit_file_id")
        .eq("id", id)
        .single();

      if (currentItem?.imagekit_file_id) {
        fileIdToDelete = currentItem.imagekit_file_id;
      }
    }

    const { data, error } = await supabase
      .from("gallery")
      .update({
        ...updateData,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Update gallery item error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up storage if item was rejected
    if (fileIdToDelete && updateData.status === "rejected") {
      try {
        const deleteSuccess = await deleteImageKitFile(fileIdToDelete);
        if (!deleteSuccess) {
          console.warn(
            `Failed to clean up storage for rejected item ${id}, but status was updated`
          );
        }
      } catch (storageError) {
        console.error(
          "Error cleaning up storage for rejected item:",
          storageError
        );
        // Don't fail the request if storage cleanup fails
      }
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("Update gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery item (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await createAdminClient();
    const { id } = await params;

    // First, get the file info before deleting the record
    const { data: galleryItem, error: fetchError } = await supabase
      .from("gallery")
      .select("file_url, imagekit_file_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching gallery item:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Delete the database record
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      console.error("Delete gallery item error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up the file from ImageKit storage
    if (galleryItem?.imagekit_file_id) {
      try {
        const deleteSuccess = await deleteImageKitFile(
          galleryItem.imagekit_file_id
        );
        if (!deleteSuccess) {
          console.warn(
            `Failed to clean up storage for item ${id}, but database record was deleted`
          );
        }
      } catch (storageError) {
        console.error("Error cleaning up storage:", storageError);
        // Don't fail the request if storage cleanup fails
      }
    } else if (galleryItem?.file_url) {
      console.warn(
        `No ImageKit file ID found for item ${id}, cannot clean up storage`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
