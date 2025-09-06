"use client";

import { useState, useRef } from "react";
import {
  Upload as UploadIcon,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Tag,
} from "lucide-react";
import { SuccessModal } from "./Modal";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: "image" | "video";
  status: "uploading" | "success" | "error";
  file?: File;
}

interface UploadFormProps {
  mode: "user" | "admin";
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  successMessage?: string | null;
}

export default function UploadForm({
  mode,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
  successMessage = null,
}: UploadFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "events",
    name: "",
    email: "",
    phone: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    addFilesToUpload(Array.from(files));
  };

  const addFilesToUpload = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type.startsWith("image/") ? "image" : "video",
      status: "uploading",
      file: file,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    addFilesToUpload(files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "events",
      name: "",
      email: "",
      phone: "",
    });
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) return;

    const formDataToSend = new FormData();

    // Add form data
    formDataToSend.append(
      "title",
      formData.title || `Upload by ${formData.name || "Admin"}`
    );
    formDataToSend.append(
      "description",
      formData.description ||
        `Photos/videos uploaded by ${formData.name || "Admin"}`
    );
    formDataToSend.append("category", formData.category || "General");

    // Add uploader information based on mode
    if (mode === "user") {
      formDataToSend.append("uploaderName", formData.name);
      formDataToSend.append("uploaderEmail", formData.email);
      formDataToSend.append("uploaderPhone", formData.phone || "");
      // User uploads need approval
      formDataToSend.append("status", "pending");
    } else {
      formDataToSend.append("uploaderName", "Admin");
      formDataToSend.append("uploaderEmail", "admin@brothersbalganesh.com");
      formDataToSend.append("uploaderPhone", "");
      // Admin uploads are auto-approved
      formDataToSend.append("status", "approved");
    }

    // Add files
    uploadedFiles.forEach(fileObj => {
      if (fileObj.file) {
        formDataToSend.append("files", fileObj.file);
      }
    });

    await onSubmit(formDataToSend);

    // Clear form after successful submission
    clearForm();

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title and Description - Admin mode only */}
          {mode === "admin" && (
            <>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                    placeholder="Enter title for the gallery item"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  placeholder="Enter description for the gallery item"
                />
              </div>
            </>
          )}

          {/* Uploader Information - User mode only */}
          {mode === "user" && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </>
          )}

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              >
                <option value="events">Events</option>
                <option value="aarti">Aarti & Puja</option>
                <option value="cultural">Cultural Programs</option>
                <option value="community">Community Activities</option>
                <option value="celebration">Celebrations</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Description - User mode only */}
          {mode === "user" && (
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base resize-none"
                placeholder="Describe your photos/videos (e.g., 'Aarti ceremony moments', 'Cultural dance performance')"
                rows={3}
              />
            </div>
          )}

          {/* File Upload */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Select Files <span className="text-red-500">*</span>
            </h3>

            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-400 transition-all duration-300 hover:bg-orange-50"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <p className="text-xl font-medium text-gray-900 mb-3">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Support for JPG, PNG, MP4 files. Max 5MB per image, 25MB for
                bulk, 100MB for video.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Upload Error</p>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Upload Successful</p>
              </div>
              <p className="text-green-700 mt-1">{successMessage}</p>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Files ({uploadedFiles.length})
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      {file.type === "image" ? (
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Video className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === "uploading" && (
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {file.status === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={uploadedFiles.length === 0 || isSubmitting}
              className="w-full px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors font-medium text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  <span>
                    {mode === "admin" ? "Upload Gallery Item" : "Submit Upload"}
                  </span>
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={mode === "admin" ? "Upload Complete!" : "Upload Successful!"}
        message={
          mode === "admin"
            ? "Your gallery item has been uploaded and is now live in the gallery."
            : "Your files have been uploaded successfully. They will be reviewed by our admin team and added to the gallery once approved."
        }
        confirmText="Continue"
        onConfirm={handleSuccessModalClose}
      />
    </>
  );
}
