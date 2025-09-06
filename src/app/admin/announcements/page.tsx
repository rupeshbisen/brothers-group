"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  Calendar as CalendarIcon,
  Heart,
} from "lucide-react";
import Modal from "@/components/Modal";
import AdminPageHeader from "@/components/AdminPageHeader";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "event" | "donation" | "urgent";
  status: "active" | "inactive";
  created_at: string;
  created_by: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general" as "general" | "event" | "donation" | "urgent",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Fetch all announcements for admin panel (no filter)
      const response = await fetch("/api/announcements");
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAnnouncement
        ? `/api/announcements/${editingAnnouncement.id}`
        : "/api/announcements";

      const method = editingAnnouncement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingAnnouncement(null);
        resetForm();
        fetchAnnouncements();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Failed to save announcement");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      status: announcement.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAnnouncements();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "general",
      status: "active",
    });
  };

  const openNewAnnouncementModal = () => {
    setEditingAnnouncement(null);
    resetForm();
    setShowModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "event":
        return <CalendarIcon className="w-4 h-4 text-blue-600" />;
      case "donation":
        return <Heart className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-green-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "event":
        return "bg-blue-100 text-blue-800";
      case "donation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="Announcement Management"
        subtitle="Manage community announcements and notifications"
        icon={Bell}
        iconColor="text-yellow-600"
        iconBgColor="bg-yellow-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Announcement Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={openNewAnnouncementModal}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Announcements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Info className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">General</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.type === "general").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CalendarIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.type === "event").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.type === "urgent").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Donation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.type === "donation").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Announcements
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Announcement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                {announcements.map(announcement => (
                  <tr key={announcement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {announcement.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {announcement.content}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(announcement.type)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                            announcement.type
                          )}`}
                        >
                          {announcement.type.charAt(0).toUpperCase() +
                            announcement.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          announcement.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {announcement.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
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
        title={
          editingAnnouncement ? "Edit Announcement" : "Add New Announcement"
        }
        message=""
      >
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={e =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                placeholder="Enter announcement content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={e =>
                  setFormData({
                    ...formData,
                    type: e.target.value as
                      | "general"
                      | "event"
                      | "donation"
                      | "urgent",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="general">General</option>
                <option value="event">Event</option>
                <option value="donation">Donation</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="status"
                checked={formData.status === "active"}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? "active" : "inactive",
                  })
                }
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="status"
                className="ml-2 block text-sm text-gray-900"
              >
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                {editingAnnouncement
                  ? "Update Announcement"
                  : "Create Announcement"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
