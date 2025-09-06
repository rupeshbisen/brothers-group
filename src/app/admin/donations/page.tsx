"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  IndianRupee,
  Eye,
  Filter,
  Mail,
  XCircle,
  Undo2,
  Calendar,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import Modal from "@/components/Modal";
import AdminPageHeader from "@/components/AdminPageHeader";

interface Donation {
  id: string;
  donor_name: string;
  donor_email?: string;
  donor_phone?: string;
  amount: number;
  currency?: string;
  payment_method?: "upi" | "bank_transfer" | "cash" | "online" | string;
  transaction_id?: string;
  status: "pending" | "completed" | "failed" | "refunded" | string;
  receipt_sent?: boolean;
  receipt_email?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export default function AdminDonationsPage() {
  const router = useRouter();
  const [adminUser] = useState(getAdminUser());
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === "all"
          ? "/api/donations"
          : `/api/donations?status=${statusFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (e) {
      setError((e as Error).message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin");
      return;
    }
    fetchDonations();
  }, [adminUser, router, fetchDonations]);

  const openModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDonation(null);
    setShowModal(false);
  };

  const updateDonation = async (id: string, body: Record<string, unknown>) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update donation");
      const updated = await res.json();
      setDonations(prev =>
        prev.map(d => (d.id === id ? { ...d, ...updated } : d))
      );
      if (selectedDonation?.id === id)
        setSelectedDonation({ ...(selectedDonation as Donation), ...updated });
    } catch (e) {
      alert((e as Error).message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const markCompleted = (id: string) =>
    updateDonation(id, { status: "completed" });
  const markFailed = (id: string) => updateDonation(id, { status: "failed" });
  const markRefunded = (id: string) =>
    updateDonation(id, { status: "refunded" });
  const sendReceipt = (d: Donation) =>
    updateDonation(d.id, {
      receipt_sent: true,
      receipt_email: d.donor_email || d.receipt_email,
    });

  const filtered = donations.filter(d => {
    const q = search.toLowerCase();
    const matchesQ =
      d.donor_name?.toLowerCase().includes(q) ||
      d.donor_email?.toLowerCase().includes(q) ||
      d.transaction_id?.toLowerCase().includes(q) ||
      String(d.amount).includes(q);
    return matchesQ;
  });

  const totalAmount = donations.reduce(
    (sum, d) => sum + (Number(d.amount) || 0),
    0
  );
  const completedAmount = donations
    .filter(d => d.status === "completed")
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  if (!adminUser) return null;

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800"; // pending
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="Donations"
        subtitle="Manage donations and receipts"
        icon={IndianRupee}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Donations
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Completed Amount
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  ₹{completedAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {donations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, transaction or amount..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                onClick={fetchDonations}
                className="px-2 md:px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading donations...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-red-600">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error loading donations
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No donations found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
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
                  {filtered.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {d.donor_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {d.donor_email || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        ₹{Number(d.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {d.payment_method || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                            d.status
                          )}`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(d.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal(d)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {d.status !== "completed" && (
                            <button
                              onClick={() => markCompleted(d.id)}
                              disabled={updatingId === d.id}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 disabled:opacity-50"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {d.status !== "failed" &&
                            d.status !== "completed" && (
                              <button
                                onClick={() => markFailed(d.id)}
                                disabled={updatingId === d.id}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                                title="Mark as Failed"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          {d.status === "completed" && (
                            <button
                              onClick={() => markRefunded(d.id)}
                              disabled={updatingId === d.id}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 disabled:opacity-50"
                              title="Mark as Refunded"
                            >
                              <Undo2 className="w-4 h-4" />
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

      {/* Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Donation Details"
        message=""
        showCloseButton={true}
        className="max-w-3xl"
      >
        {selectedDonation && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Donor Name</p>
                <p className="text-gray-900 font-medium">
                  {selectedDonation.donor_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">
                  {selectedDonation.donor_email || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-gray-900 font-semibold">
                  ₹{Number(selectedDonation.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="text-gray-900 capitalize">
                  {selectedDonation.payment_method || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="text-gray-900">
                  {selectedDonation.transaction_id || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                    selectedDonation.status
                  )}`}
                >
                  {selectedDonation.status}
                </span>
              </div>
            </div>

            {selectedDonation.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedDonation.notes}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-2">
                {selectedDonation.status !== "completed" && (
                  <button
                    onClick={() => markCompleted(selectedDonation.id)}
                    disabled={updatingId === selectedDonation.id}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    <span className="inline-flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </span>
                  </button>
                )}
                {selectedDonation.status !== "failed" &&
                  selectedDonation.status !== "completed" && (
                    <button
                      onClick={() => markFailed(selectedDonation.id)}
                      disabled={updatingId === selectedDonation.id}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <span className="inline-flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        Mark as Failed
                      </span>
                    </button>
                  )}
                {selectedDonation.status === "completed" && (
                  <button
                    onClick={() => markRefunded(selectedDonation.id)}
                    disabled={updatingId === selectedDonation.id}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <span className="inline-flex items-center">
                      <Undo2 className="w-4 h-4 mr-2" />
                      Mark as Refunded
                    </span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    selectedDonation && sendReceipt(selectedDonation)
                  }
                  disabled={
                    updatingId === selectedDonation?.id ||
                    selectedDonation.receipt_sent
                  }
                  className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {selectedDonation.receipt_sent
                      ? "Receipt Sent"
                      : "Send Receipt"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
