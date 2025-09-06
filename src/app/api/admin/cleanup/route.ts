import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { deleteImageKitFile } from "@/lib/imagekit";

// POST - Cleanup rejected gallery items older than 30 days
export async function POST() {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await createAdminClient();

    // Find all rejected items older than 30 days
    const { data: rejectedItems, error: fetchError } = await supabase
      .from("gallery")
      .select("id, imagekit_file_id, file_url, title")
      .eq("status", "rejected")
      .lt(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (fetchError) {
      console.error("Error fetching rejected items:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!rejectedItems || rejectedItems.length === 0) {
      return NextResponse.json({
        message: "No rejected items older than 30 days found",
        cleanedCount: 0,
      });
    }

    let cleanedCount = 0;
    let imagekitCleanupCount = 0;
    const cleanupResults = [];

    // Process each rejected item
    for (const item of rejectedItems) {
      try {
        // Clean up ImageKit file if file ID exists
        if (item.imagekit_file_id) {
          const deleteSuccess = await deleteImageKitFile(item.imagekit_file_id);
          if (deleteSuccess) {
            imagekitCleanupCount++;
          } else {
            console.warn(
              `Failed to delete ImageKit file: ${item.imagekit_file_id}`
            );
          }
        }

        // Delete the database record
        const { error: deleteError } = await supabase
          .from("gallery")
          .delete()
          .eq("id", item.id);

        if (deleteError) {
          console.error(`Error deleting item ${item.id}:`, deleteError);
          cleanupResults.push({
            id: item.id,
            title: item.title,
            success: false,
            error: deleteError.message,
          });
        } else {
          cleanedCount++;
          cleanupResults.push({
            id: item.id,
            title: item.title,
            success: true,
            imagekitCleaned: !!item.imagekit_file_id,
          });
        }
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
        cleanupResults.push({
          id: item.id,
          title: item.title,
          success: false,
          error: "Processing error",
        });
      }
    }

    return NextResponse.json({
      message: `Cleanup completed successfully`,
      cleanedCount,
      imagekitCleanupCount,
      totalProcessed: rejectedItems.length,
      results: cleanupResults,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get cleanup statistics
export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Get count of rejected items older than 30 days
    const { data: oldRejectedItems, error: fetchError } = await supabase
      .from("gallery")
      .select("id", { count: "exact" })
      .eq("status", "rejected")
      .lt(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (fetchError) {
      console.error("Error fetching cleanup statistics:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Get total rejected items count
    const { data: totalRejectedItems, error: totalError } = await supabase
      .from("gallery")
      .select("id", { count: "exact" })
      .eq("status", "rejected");

    if (totalError) {
      console.error("Error fetching total rejected items:", totalError);
      return NextResponse.json({ error: totalError.message }, { status: 500 });
    }

    return NextResponse.json({
      cleanupStats: {
        itemsEligibleForCleanup: oldRejectedItems?.length || 0,
        totalRejectedItems: totalRejectedItems?.length || 0,
        cleanupThreshold: "30 days",
      },
    });
  } catch (error) {
    console.error("Error getting cleanup statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
