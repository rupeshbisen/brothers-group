"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  XCircle,
  Home,
} from "lucide-react";
import Modal from "@/components/Modal";
import AdminPageHeader from "@/components/AdminPageHeader";

interface Banner {
  id: string;
  image_url: string;
  imagekit_file_id?: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // Fetch all banners for admin panel (no filter)
      const response = await fetch("/api/banners");
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("is_active", isActive.toString());
      formDataToSend.append("image", selectedImage);

      const response = await fetch("/api/banners", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchBanners();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create banner");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Failed to save banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBanners();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview("");
    setIsActive(true);
  };

  const openNewBannerModal = () => {
    resetForm();
    setShowModal(true);
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: !banner.is_active,
        }),
      });

      if (response.ok) {
        fetchBanners();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update banner status");
      }
    } catch (error) {
      console.error("Error updating banner status:", error);
      alert("Failed to update banner status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="Banner Management"
        subtitle="Manage home page banners and announcements"
        icon={Home}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Banner Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={openNewBannerModal}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Banner
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <ImageIcon className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Banners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {banners.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Banners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {banners.filter(b => b.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Inactive Banners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {banners.filter(b => !b.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Banners</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map(banner => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24 relative">
                          <Image
                            src={banner.image_url}
                            alt="Banner"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm text-gray-500">
                            Banner Image
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {banner.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(banner.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleBannerStatus(banner)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                            banner.is_active ? "bg-orange-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              banner.is_active
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message=""
        title="Add New Banner"
        showCloseButton={true}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image *
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImage(file);
                    const reader = new FileReader();
                    reader.onload = e => {
                      setImagePreview(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {selectedImage && (
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium">Selected file:</span>{" "}
                  {selectedImage.name}
                </div>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm"
            >
              Create Banner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
