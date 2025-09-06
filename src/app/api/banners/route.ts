import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// No ImageKit initialization needed - we'll use fetch API like in gallery upload

// GET - Fetch banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });

    // If admin and no specific filter, show all banners
    if (isAdmin && isActive === null) {
      // Don't filter by is_active - show all banners
    } else if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    } else {
      // By default, only show active banners for public access
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Banner query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new banner (Admin only)
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
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "super_admin" && profile.role !== "content_admin")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const formData = await request.formData();
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File;

    // Validate required fields - only image is required
    if (!imageFile) {
      return NextResponse.json(
        { error: "Banner image is required" },
        { status: 400 }
      );
    }

    // Upload image to ImageKit using FormData (same approach as gallery upload)
    const imagekitUploadUrl = process.env.IMAGEKIT_UPLOAD_URL;
    if (!imagekitUploadUrl) {
      return NextResponse.json(
        { error: "ImageKit upload URL is not configured" },
        { status: 500 }
      );
    }
    const imagekitFormData = new FormData();
    imagekitFormData.append("file", imageFile);
    imagekitFormData.append("fileName", `${Date.now()}-${imageFile.name}`);
    imagekitFormData.append("folder", "/brothers-bal-ganesh/banners");
    imagekitFormData.append("useUniqueFileName", "true");
    imagekitFormData.append("responseFields", "url,fileId,name");

    const imagekitResponse = await fetch(imagekitUploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.IMAGEKIT_PRIVATE_KEY + ":"
        ).toString("base64")}`,
      },
      body: imagekitFormData,
    });

    if (!imagekitResponse.ok) {
      const errorText = await imagekitResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      console.error("ImageKit Error:", {
        status: imagekitResponse.status,
        statusText: imagekitResponse.statusText,
        error: errorData,
      });

      return NextResponse.json(
        {
          error: `ImageKit upload failed: ${
            errorData.message || errorData.error || "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }

    const imagekitData = await imagekitResponse.json();
    const imageUrl = imagekitData.url;
    const fileId = imagekitData.fileId;

    // Create banner in database
    const { data, error } = await supabase
      .from("banners")
      .insert([
        {
          image_url: imageUrl,
          imagekit_file_id: fileId,
          is_active: isActive,
          created_by: user.id,
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
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
