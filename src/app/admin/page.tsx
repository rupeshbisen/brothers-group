"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Settings,
  Users,
  ImageIcon,
  Calendar,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAdminUser, setAdminSession } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  const adminUser = getAdminUser();
  if (adminUser) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }

      // Store admin session using the new function
      setAdminSession(data.user);

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-orange-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Sign in to manage the Brother Bal Ganesh Utsav Mandal website
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="admin@brothersbalganesh.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Admin Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-900">
              User Management
            </h3>
            <p className="text-xs text-gray-600">Manage admin users</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-900">Events</h3>
            <p className="text-xs text-gray-600">Manage events & schedules</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <ImageIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-900">Gallery</h3>
            <p className="text-xs text-gray-600">Approve uploads</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-900">Donations</h3>
            <p className="text-xs text-gray-600">Track donations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
