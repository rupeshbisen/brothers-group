"use client";

import { useState } from "react";
import { Upload as UploadIcon, CheckCircle } from "lucide-react";
import UploadForm from "@/components/UploadForm";

interface UploadResponse {
  message: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    file_url: string;
    status: string;
  }>;
}

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      setSuccessMessage(result.message);
      setUploadComplete(true);

      // Reset form after successful upload
      setTimeout(() => {
        setUploadComplete(false);
        setError(null);
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Interactive Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/8 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Animated Icon */}
            <div className="mb-8 animate-bounce">
              <UploadIcon className="w-20 h-20 mx-auto text-white/90" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Upload Your Photos
            </h1>

            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Share your memories from our celebrations. Upload photos and
              videos to contribute to our community gallery.
            </p>

            {/* Interactive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-orange-100">Photos Shared</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-orange-100">Videos Uploaded</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-orange-100">Contributors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Upload Form - Wider */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Upload Files
                </h2>

                <UploadForm
                  mode="user"
                  onSubmit={handleSubmit}
                  isSubmitting={isUploading}
                  error={error}
                  successMessage={successMessage}
                />
              </div>

              {/* Guidelines */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Upload Guidelines
                </h2>

                <div className="space-y-6">
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">
                      File Requirements
                    </h3>
                    <ul className="space-y-3 text-orange-800">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Images: JPG, PNG (max 5MB each)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Videos: MP4 (max 100MB)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Bulk upload: max 25MB total
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Content Guidelines
                    </h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Only photos/videos from our events
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Respectful and appropriate content
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        No personal or private information
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                      Review Process
                    </h3>
                    <ul className="space-y-3 text-green-800">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        All uploads are reviewed by admin
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Approved content appears in gallery
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        You&apos;ll be notified of approval status
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {uploadComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Upload Complete!
            </h3>
            <p className="text-gray-600 mb-6">
              {successMessage ||
                "Your files have been uploaded successfully. They will be reviewed by our admin team and added to the gallery once approved."}
            </p>
            <button
              onClick={() => setUploadComplete(false)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
