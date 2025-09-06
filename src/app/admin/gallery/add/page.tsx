"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import UploadForm from "@/components/UploadForm";
import AdminPageHeader from "@/components/AdminPageHeader";

export default function AddGalleryItemPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/gallery");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload gallery item");
      }
    } catch (error) {
      console.error("Error uploading gallery item:", error);
      setError("Failed to upload gallery item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="Add Gallery Item"
        subtitle="Upload photos or videos to the gallery"
        icon={Plus}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        <UploadForm
          mode="admin"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </div>
  );
}
