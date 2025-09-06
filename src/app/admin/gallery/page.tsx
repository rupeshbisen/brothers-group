"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  Video,
  Search,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import Image from "next/image";
import Modal from "@/components/Modal";
import AdminPageHeader from "@/components/AdminPageHeader";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name?: string;
  file_type: string;
  file_size: number;
  uploader_name: string;
  uploader_email: string;
  uploader_phone?: string;
  status: "pending" | "approved" | "rejected";
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const user = getAdminUser();
    if (!user) {
      router.push("/admin");
      return;
    }
    setAdminUser(user);

    // Get status filter from URL parameters
    const urlStatus = searchParams.get("status");
    if (urlStatus && ["pending", "approved", "rejected"].includes(urlStatus)) {
      setStatusFilter(urlStatus);
    }
  }, [router, searchParams]);

  const fetchGalleryItems = useCallback(async () => {
    try {
      // Use the current status filter to fetch items
      const url =
        statusFilter === "all"
          ? "/api/gallery?status=all"
          : `/api/gallery?status=${statusFilter}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data.items || []);
      } else {
        console.error(
          "Gallery API error:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Fetch gallery items when status filter changes
  useEffect(() => {
    if (adminUser) {
      fetchGalleryItems();
    }
  }, [statusFilter, adminUser, fetchGalleryItems]);

  const handleStatusUpdate = async (
    itemId: string,
    newStatus: "approved" | "rejected"
  ) => {
    // Show confirmation for rejection since it will delete the file
    if (newStatus === "rejected") {
      const confirmed = confirm(
        "Are you sure you want to reject this item? This will permanently delete the file from storage while keeping the record for reference."
      );
      if (!confirmed) return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/gallery/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          approved_by: adminUser?.id, // Use admin ID directly from session
          approved_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchGalleryItems();
      } else {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);

        // Show user-friendly error message
        if (
          errorData.error &&
          errorData.error.includes("foreign key constraint")
        ) {
          alert(
            "Please log out and log back in to refresh your admin session."
          );
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this item? This will permanently delete both the record and the file from storage."
      )
    )
      return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/gallery/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchGalleryItems();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleViewItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.uploader_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="Gallery Management"
        subtitle="Manage photo and video uploads from community members"
        icon={ImageIcon}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or uploader name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => router.push("/admin/gallery/add")}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
            <button
              onClick={() => router.push("/admin/cleanup")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Cleanup</span>
            </button>
          </div>
        </div>

        {/* Gallery Items Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.file_type.startsWith("image") ? (
                          <ImageIcon className="w-8 h-8 text-blue-600" />
                        ) : (
                          <Video className="w-8 h-8 text-red-600" />
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {item.file_name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(item.file_size)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.uploader_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.uploader_email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={processing}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(item.id, "approved")
                              }
                              className="text-green-600 hover:text-green-900"
                              disabled={processing}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(item.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900"
                              disabled={processing}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={processing}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No gallery items found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding a new gallery item."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Gallery Item Details"
        message=""
        showCloseButton={true}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem.title}
              </h3>
              <p className="text-gray-600 mt-1">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Uploader</p>
                <p className="text-sm text-gray-900">
                  {selectedItem.uploader_name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedItem.uploader_email}
                </p>
                {selectedItem.uploader_phone && (
                  <p className="text-sm text-gray-600">
                    {selectedItem.uploader_phone}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">File Info</p>
                <p className="text-sm text-gray-900">
                  {selectedItem.file_name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  {formatFileSize(selectedItem.file_size)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  selectedItem.status
                )}`}
              >
                {getStatusIcon(selectedItem.status)}
                <span className="ml-1 capitalize">{selectedItem.status}</span>
              </span>
              {selectedItem.approved_at && (
                <p className="text-sm text-gray-600 mt-1">
                  Approved on:{" "}
                  {new Date(selectedItem.approved_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {selectedItem.file_url &&
              !selectedItem.file_url.startsWith("/api/temp-upload/") && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Preview</p>
                  {selectedItem.file_type &&
                  selectedItem.file_type.startsWith("image") ? (
                    <Image
                      src={selectedItem.file_url}
                      alt={selectedItem.title}
                      width={400}
                      height={300}
                      className="mt-2 max-w-full h-auto rounded-lg border"
                      onError={e => {
                        console.error(
                          "Image failed to load:",
                          selectedItem.file_url
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : selectedItem.file_type &&
                    selectedItem.file_type.startsWith("video/") ? (
                    <video
                      src={selectedItem.file_url}
                      controls
                      className="mt-2 max-w-full rounded-lg border"
                      onError={e => {
                        console.error(
                          "Video failed to load:",
                          selectedItem.file_url
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="mt-2 p-4 bg-gray-100 rounded-lg border">
                      <p className="text-sm text-gray-600">
                        File type: {selectedItem.file_type || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        URL: {selectedItem.file_url}
                      </p>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
