"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Eye,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  User,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import Modal from "@/components/Modal";
import AdminPageHeader from "@/components/AdminPageHeader";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "resolved";
  created_at: string;
}

export default function AdminContactsPage() {
  const router = useRouter();
  const [adminUser] = useState(getAdminUser());
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is logged in
    if (!adminUser) {
      router.push("/admin");
      return;
    }
    fetchContacts();
  }, [adminUser, router]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact");

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data = await response.json();
      setContacts(data || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      setUpdatingStatus(contactId);
      const response = await fetch(`/api/contact/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setContacts(prev =>
        prev.map(contact =>
          contact.id === contactId
            ? {
                ...contact,
                status: newStatus as "unread" | "read" | "replied" | "resolved",
              }
            : contact
        )
      );

      // Close modal if viewing this contact
      if (selectedContact?.id === contactId) {
        setShowViewModal(false);
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openViewModal = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedContact(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread":
        return <Clock className="w-4 h-4" />;
      case "read":
        return <Eye className="w-4 h-4" />;
      case "replied":
        return <CheckCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "unread":
        return "Unread";
      case "read":
        return "Read";
      case "replied":
        return "Replied";
      case "resolved":
        return "Resolved";
      default:
        return "Unknown";
    }
  };

  // Filter contacts based on search and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getUnreadCount = () =>
    contacts.filter(c => c.status === "unread").length;

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="Contact Management"
        subtitle="Manage contact form submissions"
        icon={Mail}
        iconColor="text-indigo-600"
        iconBgColor="bg-indigo-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Contacts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Unread Messages
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getUnreadCount()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter(c => c.status === "replied").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-purple-600">
                  {contacts.filter(c => c.status === "read").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading contacts...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-red-600">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error loading contacts
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No contacts found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No contact submissions yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
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
                  {filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="text-sm text-gray-500">
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {contact.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            contact.status
                          )}`}
                        >
                          {getStatusIcon(contact.status)}
                          <span className="ml-1">
                            {getStatusText(contact.status)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openViewModal(contact)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {contact.status === "unread" && (
                            <button
                              onClick={() =>
                                updateContactStatus(contact.id, "read")
                              }
                              disabled={updatingStatus === contact.id}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 disabled:opacity-50"
                              title="Mark as Read"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {contact.status !== "replied" &&
                            contact.status !== "resolved" && (
                              <button
                                onClick={() =>
                                  updateContactStatus(contact.id, "replied")
                                }
                                disabled={updatingStatus === contact.id}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 disabled:opacity-50"
                                title="Mark as Replied"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                          {contact.status !== "resolved" && (
                            <button
                              onClick={() =>
                                updateContactStatus(contact.id, "resolved")
                              }
                              disabled={updatingStatus === contact.id}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 disabled:opacity-50"
                              title="Mark as Resolved"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Contact Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={closeViewModal}
        title="Contact Details"
        message=""
        showCloseButton={true}
        className="max-w-3xl"
      >
        {selectedContact && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Subject
                  </label>
                  <p className="text-gray-900">{selectedContact.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedContact.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedContact.status
                    )}`}
                  >
                    {getStatusIcon(selectedContact.status)}
                    <span className="ml-1">
                      {getStatusText(selectedContact.status)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Message
              </label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-72 overflow-auto">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-2">
                {selectedContact.status === "unread" && (
                  <button
                    onClick={() =>
                      updateContactStatus(selectedContact.id, "read")
                    }
                    disabled={updatingStatus === selectedContact.id}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                  >
                    <span className="inline-flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Mark as Read
                    </span>
                  </button>
                )}

                {selectedContact.status !== "replied" &&
                  selectedContact.status !== "resolved" && (
                    <button
                      onClick={() =>
                        updateContactStatus(selectedContact.id, "replied")
                      }
                      disabled={updatingStatus === selectedContact.id}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      <span className="inline-flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Replied
                      </span>
                    </button>
                  )}

                {selectedContact.status !== "resolved" && (
                  <button
                    onClick={() =>
                      updateContactStatus(selectedContact.id, "resolved")
                    }
                    disabled={updatingStatus === selectedContact.id}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <span className="inline-flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
