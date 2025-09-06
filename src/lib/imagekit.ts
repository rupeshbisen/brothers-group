// ImageKit utility functions

export interface ImageKitDeleteResponse {
  message: string;
}

/**
 * Delete a file from ImageKit storage using file ID
 * @param fileId - The ImageKit file ID
 * @returns Promise<boolean> - true if successful, false if failed
 */
export async function deleteImageKitFile(fileId: string): Promise<boolean> {
  try {
    if (!fileId || !process.env.IMAGEKIT_PRIVATE_KEY) {
      console.error("Missing ImageKit configuration or file ID");
      return false;
    }

    // ImageKit delete API endpoint using file ID
    const deleteUrl = `${process.env.IMAGEKIT_API_URL}/${fileId}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      console.error(
        `Failed to delete file from ImageKit: ${fileId}`,
        errorData
      );
      return false;
    }
  } catch (error) {
    console.error("Error deleting file from ImageKit:", error);
    return false;
  }
}

/**
 * Extract file ID from ImageKit URL for deletion
 * @param fileUrl - The ImageKit file URL
 * @returns string | null - The file ID or null if invalid
 */
export function extractImageKitFileId(fileUrl: string): string | null {
  try {
    // For ImageKit URLs like: https://ik.imagekit.io/bucket/folder/filename.jpg
    // We need to extract the filename which serves as the file ID
    const urlParts = fileUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (fileName && fileName.includes(".")) {
      return fileName;
    }

    return null;
  } catch (error) {
    console.error("Error extracting ImageKit file ID:", error);
    return null;
  }
}
