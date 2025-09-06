"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Users,
  Calendar,
  Image as ImageIcon,
  Heart,
  Bell,
  TrendingUp,
  Upload,
  LogOut,
  Plus,
  Eye,
  Home,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Trash2,
  Mail,
  QrCode,
  Download,
  Loader2,
} from "lucide-react";
import { getAdminUser, clearAdminSession } from "@/lib/auth";
import { cache, CACHE_KEYS, STALE_TIMES } from "@/lib/cache";

interface DashboardStats {
  totalEvents: number;
  totalGalleryItems: number;
  pendingUploads: number;
  unreadContacts: number;
}

interface RecentUpload {
  id: string;
  title: string;
  uploader_name: string;
  created_at: string;
  file_type: string;
  status: string;
}

interface RecentDonation {
  id: string;
  donor_name: string;
  amount: number;
  created_at: string;
  status: string;
}

interface RecentContact {
  id: string;
  name: string;
  subject: string;
  created_at: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(getAdminUser());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalGalleryItems: 0,
    pendingUploads: 0,
    unreadContacts: 0,
  });
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);

  useEffect(() => {
    // Check if admin is logged in
    if (!adminUser) {
      router.push("/admin");
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [adminUser, router]);

  const fetchDashboardData = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedStats = cache.get<DashboardStats>(
          CACHE_KEYS.DASHBOARD_STATS
        );
        const cachedUploads = cache.get<RecentUpload[]>(
          CACHE_KEYS.RECENT_UPLOADS
        );
        const cachedDonations = cache.get<RecentDonation[]>(
          CACHE_KEYS.RECENT_DONATIONS
        );
        const cachedContacts = cache.get<RecentContact[]>(
          CACHE_KEYS.RECENT_CONTACTS
        );

        // If all data is cached and not stale, use cached data
        if (cachedStats && cachedUploads && cachedDonations && cachedContacts) {
          setStats(cachedStats);
          setRecentUploads(cachedUploads);
          setRecentDonations(cachedDonations);
          setRecentContacts(cachedContacts);
          setLoading(false);
          return;
        }
      }

      // Fetch missing or stale data
      const fetchPromises: Promise<Response>[] = [];
      const fetchKeys: string[] = [];

      // Check what needs to be fetched
      if (forceRefresh || !cache.has(CACHE_KEYS.DASHBOARD_STATS)) {
        fetchPromises.push(fetch("/api/admin/dashboard/stats"));
        fetchKeys.push(CACHE_KEYS.DASHBOARD_STATS);
      }

      if (forceRefresh || !cache.has(CACHE_KEYS.RECENT_UPLOADS)) {
        fetchPromises.push(fetch("/api/admin/dashboard/recent-uploads"));
        fetchKeys.push(CACHE_KEYS.RECENT_UPLOADS);
      }

      if (forceRefresh || !cache.has(CACHE_KEYS.RECENT_DONATIONS)) {
        fetchPromises.push(fetch("/api/admin/dashboard/recent-donations"));
        fetchKeys.push(CACHE_KEYS.RECENT_DONATIONS);
      }

      if (forceRefresh || !cache.has(CACHE_KEYS.RECENT_CONTACTS)) {
        fetchPromises.push(fetch("/api/admin/dashboard/recent-contacts"));
        fetchKeys.push(CACHE_KEYS.RECENT_CONTACTS);
      }

      // If no data needs to be fetched, return early
      if (fetchPromises.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch data in parallel
      const responses = await Promise.all(fetchPromises);

      // Process responses and update cache
      responses.forEach((response, index) => {
        const key = fetchKeys[index];

        if (response.ok) {
          response.json().then((data: unknown) => {
            // Cache the data
            cache.set(key, data, STALE_TIMES[key as keyof typeof STALE_TIMES]);

            // Update state
            switch (key) {
              case CACHE_KEYS.DASHBOARD_STATS:
                setStats(data as DashboardStats);
                break;
              case CACHE_KEYS.RECENT_UPLOADS:
                setRecentUploads(data as RecentUpload[]);
                break;
              case CACHE_KEYS.RECENT_DONATIONS:
                setRecentDonations(data as RecentDonation[]);
                break;
              case CACHE_KEYS.RECENT_CONTACTS:
                setRecentContacts(data as RecentContact[]);
                break;
            }
          });
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear session
      clearAdminSession();
      setAdminUser(null);
      router.push("/admin");
    }
  };

  const statsCards = [
    {
      title: "Total Events",
      value: stats.totalEvents.toString(),
      change: "+0",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Gallery Items",
      value: stats.totalGalleryItems.toString(),
      change: "+0",
      icon: ImageIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Uploads",
      value: stats.pendingUploads.toString(),
      change: "-0",
      icon: Upload,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Unread Contacts",
      value: stats.unreadContacts.toString(),
      change: "+0",
      icon: Mail,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const adminSections = [
    {
      title: "Home Banner Management",
      description: "Manage homepage banners and featured content",
      icon: Home,
      color: "bg-green-500",
      href: "/admin/banners",
      features: [
        { name: "Manage Banners", href: "/admin/banners", icon: Eye },
        { name: "Banner Settings", href: "/admin/banners", icon: Settings },
      ],
    },
    {
      title: "Events Management",
      description: "Create, edit, and manage all events and programs",
      icon: Calendar,
      color: "bg-blue-500",
      href: "/admin/events",
      features: [
        { name: "Add New Event", href: "/admin/events/add", icon: Plus },
        { name: "Event Calendar", href: "/admin/events", icon: Calendar },
      ],
    },
    {
      title: "Gallery & Upload Management",
      description: "Manage photo and video uploads from community members",
      icon: ImageIcon,
      color: "bg-purple-500",
      href: "/admin/gallery",
      features: [
        {
          name: "Pending Reviews",
          href: "/admin/gallery?status=pending",
          icon: Clock,
        },
        { name: "Add Gallery Item", href: "/admin/gallery/add", icon: Plus },
      ],
    },
    {
      title: "Donation Management",
      description: "Track and manage all donations and contributions",
      icon: Heart,
      color: "bg-red-500",
      href: "/admin/donations",
      features: [
        { name: "View Donations", href: "/admin/donations", icon: Eye },
        { name: "Donation Reports", href: "/admin/donations", icon: BarChart3 },
      ],
    },
    {
      title: "Announcements",
      description: "Create and manage important announcements",
      icon: Bell,
      color: "bg-yellow-500",
      href: "/admin/announcements",
      features: [
        {
          name: "Manage Announcements",
          href: "/admin/announcements",
          icon: Bell,
        },
        {
          name: "Announcement Settings",
          href: "/admin/announcements",
          icon: Settings,
        },
      ],
    },
    {
      title: "Contact Management",
      description: "View and manage contact form submissions from visitors",
      icon: Mail,
      color: "bg-indigo-500",
      href: "/admin/contacts",
      features: [
        {
          name: "Unread Messages",
          href: "/admin/contacts?status=unread",
          icon: Clock,
        },
        { name: "All Messages", href: "/admin/contacts", icon: Mail },
      ],
    },
    {
      title: "QR Code Management",
      description: "Generate and manage QR codes for website promotion",
      icon: QrCode,
      color: "bg-emerald-500",
      href: "/admin/qr-codes",
      features: [
        { name: "Generate QR Code", href: "/admin/qr-codes", icon: QrCode },
        { name: "Download QR Codes", href: "/admin/qr-codes", icon: Download },
      ],
    },
    {
      title: "System Cleanup",
      description: "Clean up old rejected items and maintain system health",
      icon: Trash2,
      color: "bg-gray-500",
      href: "/admin/cleanup",
      features: [
        { name: "Cleanup Dashboard", href: "/admin/cleanup", icon: Eye },
        { name: "Cleanup Settings", href: "/admin/cleanup", icon: Settings },
      ],
    },
    {
      title: "User Management",
      description: "Super Admin: Manage admin users and permissions",
      icon: Users,
      color: "bg-orange-500",
      href: "/admin/users",
      features: [
        { name: "Manage Users", href: "/admin/users", icon: Users },
        { name: "User Settings", href: "/admin/users", icon: Settings },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Brother Bal Ganesh Utsav Mandal
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {adminUser?.name || adminUser?.email}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  {adminUser?.role || "Admin"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 md:py-2 text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {adminUser?.name || "Admin"}! 👋
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Manage your community events, gallery, donations, and more from
              this central dashboard.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Overview Statistics
            </h3>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : (
              statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon
                        className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`}
                      />
                    </div>
                  </div>
                  <div className="mt-3 md:mt-4 flex items-center">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
                    <span className="text-xs md:text-sm text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 ml-1 hidden sm:inline">
                      from last month
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
            Management Sections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {adminSections.map((section, index) => {
              // Hide User Management for non-super_admin users
              if (
                section.title === "User Management" &&
                adminUser?.role !== "super_admin"
              ) {
                return null;
              }

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex items-start space-x-2 md:space-x-3 mb-3 md:mb-4">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 ${section.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <section.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          {section.title}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                      {section.features.map((feature, featureIndex) => (
                        <button
                          key={featureIndex}
                          onClick={() => router.push(feature.href)}
                          className="w-full text-left flex items-center justify-between p-1.5 md:p-2 rounded-md hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center space-x-1.5 md:space-x-2">
                            <feature.icon className="w-3 h-3 md:w-4 md:h-4 text-gray-500 group-hover:text-gray-700" />
                            <span className="text-xs md:text-sm text-gray-700 group-hover:text-gray-900">
                              {feature.name}
                            </span>
                          </div>
                          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Uploads */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Recent Uploads
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={loading}
                  className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                  title="Refresh data"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => router.push("/admin/gallery")}
                  className="text-xs md:text-sm text-orange-600 hover:text-orange-700"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : recentUploads.length === 0 ? (
                <p className="text-center text-gray-500">
                  No recent uploads found.
                </p>
              ) : (
                recentUploads.map(upload => (
                  <div
                    key={upload.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {upload.file_type === "video" ? (
                          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        ) : (
                          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {upload.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          by {upload.uploader_name} •{" "}
                          {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
                          upload.status
                        )}`}
                      >
                        {getStatusIcon(upload.status)}
                        <span className="capitalize">{upload.status}</span>
                      </span>

                      {upload.status === "pending" && (
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Donations
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={loading}
                  className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                  title="Refresh data"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => router.push("/admin/donations")}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : recentDonations.length === 0 ? (
                <p className="text-center text-gray-500">
                  No recent donations found.
                </p>
              ) : (
                recentDonations.map(donation => (
                  <div
                    key={donation.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 rounded-lg space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          ₹{donation.amount.toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {donation.donor_name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 self-end sm:self-center">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Contacts
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={loading}
                  className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                  title="Refresh data"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => router.push("/admin/contacts")}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : recentContacts.length === 0 ? (
                <p className="text-center text-gray-500">
                  No recent contacts found.
                </p>
              ) : (
                recentContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 sm:w-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {contact.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {contact.subject} •{" "}
                          {new Date(contact.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                          contact.status === "unread"
                            ? "bg-blue-100 text-blue-800"
                            : contact.status === "read"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {contact.status === "unread" ? (
                          <Clock className="w-4 h-4" />
                        ) : contact.status === "read" ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span className="capitalize">{contact.status}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
