import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// POST - Public upload endpoint for users
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const uploaderName = formData.get("uploaderName") as string;
    const uploaderEmail = formData.get("uploaderEmail") as string;
    const uploaderPhone = formData.get("uploaderPhone") as string;
    const status = (formData.get("status") as string) || "pending";
    const files = formData.getAll("files") as File[];

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !uploaderName ||
      !uploaderEmail ||
      files.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use admin client for bypassing RLS policies
    const supabaseAdmin = await createAdminClient();

    // Upload files to ImageKit
    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type and size
      const fileType = file.type;
      const fileSize = file.size;

      if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
        return NextResponse.json(
          { error: "Invalid file type. Only images and videos are allowed." },
          { status: 400 }
        );
      }

      const maxSize = fileType.startsWith("video/")
        ? parseInt(process.env.MAX_VIDEO_SIZE || "104857600") // 100MB default
        : parseInt(process.env.MAX_IMAGE_SIZE || "5242880"); // 5MB default
      if (fileSize > maxSize) {
        return NextResponse.json(
          {
            error: `File too large. Max size: ${
              fileType.startsWith("video/") ? "100MB" : "5MB"
            } (${Math.round(maxSize / (1024 * 1024))}MB)`,
          },
          { status: 400 }
        );
      }

      // Check if ImageKit credentials are available
      if (!process.env.IMAGEKIT_PRIVATE_KEY) {
        console.error(
          "ImageKit configuration missing. Using temporary local storage..."
        );

        // Temporary fallback: Store file info without actual file upload
        uploadedFiles.push({
          file_url: `/api/temp-upload/${Date.now()}-${file.name}`, // Placeholder URL
          file_name: file.name,
          file_size: fileSize,
          file_type: fileType,
          type: fileType.startsWith("image/") ? "image" : "video",
          imagekit_file_id: `temp-${Date.now()}`,
        });

        continue; // Skip to next file
      }

      try {
        // Upload to ImageKit using FormData (correct format)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", `${Date.now()}-${file.name}`);
        formData.append("folder", "/brothers-bal-ganesh/gallery");
        formData.append("useUniqueFileName", "true");
        formData.append("responseFields", "url,fileId,name");

        const imagekitUploadUrl = process.env.IMAGEKIT_UPLOAD_URL;
        if (!imagekitUploadUrl) {
          return NextResponse.json(
            { error: "ImageKit upload URL is not configured" },
            { status: 500 }
          );
        }

        const imagekitResponse = await fetch(imagekitUploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.IMAGEKIT_PRIVATE_KEY + ":"
            ).toString("base64")}`,
          },
          body: formData,
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
            hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
            privateKeyLength: process.env.IMAGEKIT_PRIVATE_KEY?.length,
          });

          return NextResponse.json(
            {
              error: `ImageKit upload failed: ${
                errorData.message || errorData.error || "Unknown error"
              }. Please check your ImageKit configuration.`,
            },
            { status: 500 }
          );
        }

        const imagekitData = await imagekitResponse.json();

        uploadedFiles.push({
          file_url: imagekitData.url,
          file_name: file.name,
          file_size: fileSize,
          file_type: fileType,
          type: fileType.startsWith("image/") ? "image" : "video",
          imagekit_file_id: imagekitData.fileId,
        });
      } catch (error) {
        console.error("ImageKit upload error:", error);
        return NextResponse.json(
          {
            error:
              "Failed to upload file to ImageKit. Please try again or contact administrator.",
          },
          { status: 500 }
        );
      }
    }

    // Create gallery items in database
    const galleryItems = [];

    for (const file of uploadedFiles) {
      const { data, error } = await supabaseAdmin
        .from("gallery")
        .insert([
          {
            title,
            description,
            file_url: file.file_url,
            file_type: file.file_type,
            file_size: file.file_size,
            uploader_name: uploaderName,
            uploader_email: uploaderEmail,
            uploader_phone: uploaderPhone || null,
            category: category || "General",
            imagekit_file_id: file.imagekit_file_id, // Store the ImageKit file ID
            status: status, // Use the provided status (pending for users, approved for admin)
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        );
      }

      galleryItems.push(data);
    }

    // Send email notification to admin (you can implement this later)
    // await sendUploadNotification(galleryItems)

    const isAdminUpload = status === "approved";
    const message = isAdminUpload
      ? "Upload successful! Your gallery item is now live."
      : "Upload successful! Your files are pending admin approval.";

    return NextResponse.json(
      {
        message,
        items: galleryItems,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
