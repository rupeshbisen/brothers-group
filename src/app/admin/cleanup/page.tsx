"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Info,
  Calendar,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import AdminPageHeader from "@/components/AdminPageHeader";

interface CleanupStats {
  itemsEligibleForCleanup: number;
  totalRejectedItems: number;
  cleanupThreshold: string;
}

interface CleanupResult {
  id: string;
  title: string;
  success: boolean;
  error?: string;
  imagekitCleaned?: boolean;
}

export default function CleanupDashboard() {
  const router = useRouter();
  const [adminUser] = useState(getAdminUser());
  const [stats, setStats] = useState<CleanupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupResults, setCleanupResults] = useState<CleanupResult[]>([]);
  const [lastCleanup, setLastCleanup] = useState<string | null>(null);

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin");
      return;
    }
    fetchCleanupStats();
  }, [adminUser, router]);

  const fetchCleanupStats = async () => {
    try {
      const response = await fetch("/api/admin/cleanup");
      if (response.ok) {
        const data = await response.json();
        setStats(data.cleanupStats);
      } else {
        console.error("Failed to fetch cleanup stats");
      }
    } catch (error) {
      console.error("Error fetching cleanup stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCleanup = async () => {
    if (
      !confirm(
        "Are you sure you want to clean up rejected items older than 30 days? This action cannot be undone."
      )
    ) {
      return;
    }

    setCleanupLoading(true);
    try {
      const response = await fetch("/api/admin/cleanup", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setCleanupResults(data.results || []);
        setLastCleanup(new Date().toISOString());

        // Refresh stats after cleanup
        await fetchCleanupStats();

        alert(
          `Cleanup completed! ${data.cleanedCount} items cleaned, ${data.imagekitCleanupCount} ImageKit files deleted.`
        );
      } else {
        const errorData = await response.json();
        alert(`Cleanup failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      alert("Cleanup failed. Please try again.");
    } finally {
      setCleanupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cleanup dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="System Cleanup Dashboard"
        subtitle="Clean up old rejected items and maintain system health"
        icon={Trash2}
        iconColor="text-gray-600"
        iconBgColor="bg-gray-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Eligible for Cleanup
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.itemsEligibleForCleanup || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Rejected Items
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalRejectedItems || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Cleanup Threshold
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.cleanupThreshold || "30 days"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cleanup Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Manual Cleanup
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manually trigger cleanup of rejected items older than 30 days
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {stats?.itemsEligibleForCleanup || 0} items ready for
                    cleanup
                  </p>
                  <p className="text-xs text-gray-500">
                    Items older than 30 days will be permanently deleted
                  </p>
                </div>
              </div>
              <button
                onClick={handleManualCleanup}
                disabled={
                  cleanupLoading || (stats?.itemsEligibleForCleanup || 0) === 0
                }
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {cleanupLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{cleanupLoading ? "Cleaning..." : "Run Cleanup"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Last Cleanup Results */}
        {cleanupResults.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Last Cleanup Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {lastCleanup &&
                  `Completed on ${new Date(lastCleanup).toLocaleString()}`}
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {cleanupResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      result.success ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {result.title}
                        </p>
                        {result.success && result.imagekitCleaned && (
                          <p className="text-xs text-green-600">
                            ImageKit file cleaned
                          </p>
                        )}
                        {!result.success && result.error && (
                          <p className="text-xs text-red-600">{result.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                About Automatic Cleanup
              </h3>
              <div className="mt-2 text-sm text-blue-800 space-y-2">
                <p>
                  • Rejected gallery items are automatically cleaned up after 30
                  days
                </p>
                <p>
                  • This includes both database records and ImageKit storage
                  files
                </p>
                <p>
                  • Manual cleanup can be triggered anytime for immediate action
                </p>
                <p>
                  • Cleanup is irreversible - make sure you want to delete these
                  items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
