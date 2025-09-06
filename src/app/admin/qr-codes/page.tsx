"use client";

import { useState, useEffect } from "react";
import { QrCode, Download, Copy, Settings, Trash2 } from "lucide-react";
import QRCode from "@/components/QRCode";
import AdminPageHeader from "@/components/AdminPageHeader";

interface QRCodeData {
  id: string;
  url: string;
  title: string;
  description: string;
  size: number;
  margin: number;
  created_at?: string;
}

export default function AdminQRCodesPage() {
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customSize, setCustomSize] = useState(256);
  const [customMargin, setCustomMargin] = useState(2);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [savedQRCodes, setSavedQRCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState<string | null>(null);

  // Predefined QR codes for common website sections
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }
  const predefinedQRCodes: QRCodeData[] = [
    {
      id: "home",
      url: baseUrl,
      title: "Home Page",
      description: "Main website homepage",
      size: 256,
      margin: 2,
    },
    {
      id: "events",
      url: `${baseUrl}/events`,
      title: "Events Page",
      description: "View all upcoming events",
      size: 256,
      margin: 2,
    },
    {
      id: "gallery",
      url: `${baseUrl}/gallery`,
      title: "Gallery Page",
      description: "Browse our photo and video gallery",
      size: 256,
      margin: 2,
    },
    {
      id: "donate",
      url: `${baseUrl}/donate`,
      title: "Donation Page",
      description: "Support our community initiatives",
      size: 256,
      margin: 2,
    },
    {
      id: "about",
      url: `${baseUrl}/about`,
      title: "About Us",
      description: "Learn about our organization",
      size: 256,
      margin: 2,
    },
    {
      id: "contact",
      url: `${baseUrl}/contact`,
      title: "Contact Us",
      description: "Get in touch with us",
      size: 256,
      margin: 2,
    },
  ];

  // Fetch saved QR codes from database
  useEffect(() => {
    fetchSavedQRCodes();
  }, []);

  const fetchSavedQRCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/qr-codes");
      if (response.ok) {
        const data = await response.json();
        setSavedQRCodes(data);
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQRCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this QR code?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/qr-codes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setSavedQRCodes(prev => prev.filter(qr => qr.id !== id));
        // If the deleted QR was selected, clear selection
        if (selectedQR?.id === id) {
          setSelectedQR(null);
        }
        alert("QR code deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting QR code:", error);
      alert("Error deleting QR code. Please try again.");
    }
  };

  const handleCustomQR = async () => {
    if (!customTitle || !customUrl) {
      alert("Please fill in all required fields (Title and URL)");
      return;
    }

    try {
      const response = await fetch("/api/admin/qr-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: customTitle || "Custom URL",
          description: customDescription || `Custom QR code for: ${customUrl}`,
          url: customUrl,
          size: customSize,
          margin: customMargin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        return;
      }

      const savedQR = await response.json();

      const customQR: QRCodeData = {
        id: savedQR.id,
        url: customUrl,
        title: customTitle || "Custom URL",
        description: customDescription || `Custom QR code for: ${customUrl}`,
        size: customSize,
        margin: customMargin,
      };

      setSelectedQR(customQR);
      setShowCustomForm(false);
      setCustomTitle("");
      setCustomDescription("");
      setCustomUrl("");
      alert("Custom QR code saved successfully!");
      // Refresh the saved QR codes list
      fetchSavedQRCodes();
    } catch (error) {
      console.error("Error saving QR code:", error);
      alert("Error saving QR code. Please try again.");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const downloadQR = async (qrData: QRCodeData) => {
    setDownloadingQR(qrData.id);

    try {
      // Fetch the QR code image from the external API
      const qrUrl = `${process.env.QR_CREATE_API_URI}/?size=${
        qrData.size
      }x${qrData.size}&data=${encodeURIComponent(qrData.url)}&margin=${
        qrData.margin
      }`;

      const response = await fetch(qrUrl);
      const blob = await response.blob();

      // Create a blob URL for download
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${qrData.title
        .toLowerCase()
        .replace(/\s+/g, "-")}-qr.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);

      // Show success message
      setTimeout(() => {
        alert(`QR code "${qrData.title}" downloaded successfully!`);
      }, 500);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading QR code. Please try again.");
    } finally {
      setDownloadingQR(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminPageHeader
        title="QR Code Management"
        subtitle="Generate and manage QR codes for website promotion"
        icon={QrCode}
        iconColor="text-emerald-600"
        iconBgColor="bg-emerald-100"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - QR Code List */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Predefined QR Codes
                </h2>
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Settings className="w-4 h-4" />
                  <span>Custom QR</span>
                </button>
              </div>

              {/* Custom QR Form */}
              {showCustomForm && (
                <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">
                    Generate Custom QR Code
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    Fields marked with <span className="text-red-500">*</span>{" "}
                    are required
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={e => setCustomTitle(e.target.value)}
                        placeholder="Enter a title for this QR code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={customDescription}
                        onChange={e => setCustomDescription(e.target.value)}
                        placeholder="Enter a description for this QR code"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={customUrl}
                        onChange={e => setCustomUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size (px)
                        </label>
                        <input
                          type="number"
                          value={customSize}
                          onChange={e => setCustomSize(Number(e.target.value))}
                          min="64"
                          max="1024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Margin
                        </label>
                        <input
                          type="number"
                          value={customMargin}
                          onChange={e =>
                            setCustomMargin(Number(e.target.value))
                          }
                          min="0"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={handleCustomQR}
                        disabled={!customTitle || !customUrl}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Generate QR
                      </button>
                      <button
                        onClick={() => setShowCustomForm(false)}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Predefined QR Code List */}
              <div className="space-y-3 sm:space-y-4">
                {predefinedQRCodes.map(qr => (
                  <div
                    key={qr.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                        {qr.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {qr.description}
                      </p>
                      <p className="text-xs text-blue-600 font-mono truncate">
                        {qr.url}
                      </p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end space-x-2">
                      <button
                        onClick={() => copyUrl(qr.url)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadQR(qr)}
                        disabled={downloadingQR === qr.id}
                        className="p-2 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download QR"
                      >
                        {downloadingQR === qr.id ? (
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedQR(qr)}
                        className="px-2 py-1 sm:px-3 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved Custom QR Codes */}
              <div className="mt-6 sm:mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Saved Custom QR Codes
                  </h3>
                  <button
                    onClick={fetchSavedQRCodes}
                    disabled={loading}
                    className="w-full sm:w-auto px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading saved QR codes...
                  </div>
                ) : savedQRCodes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <QrCode className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No custom QR codes saved yet</p>
                    <p className="text-sm">
                      Create your first custom QR code above!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {savedQRCodes.map(qr => (
                      <div
                        key={qr.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                            {qr.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {qr.description}
                          </p>
                          <p className="text-xs text-blue-600 font-mono truncate">
                            {qr.url}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-gray-500">
                            <span>Size: {qr.size}px</span>
                            <span>Margin: {qr.margin}px</span>
                            <span>
                              Created:{" "}
                              {qr.created_at
                                ? new Date(qr.created_at).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end space-x-2">
                          <button
                            onClick={() => copyUrl(qr.url)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadQR(qr)}
                            disabled={downloadingQR === qr.id}
                            className="p-2 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download QR"
                          >
                            {downloadingQR === qr.id ? (
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedQR(qr)}
                            className="px-2 py-1 sm:px-3 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteQRCode(qr.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete QR Code"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - QR Code Display */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                QR Code Preview
              </h2>

              {selectedQR ? (
                <div>
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">
                      {selectedQR.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedQR.description}
                    </p>
                    <p className="text-xs text-blue-600 font-mono break-all">
                      {selectedQR.url}
                    </p>
                  </div>

                  <QRCode
                    url={selectedQR.url}
                    size={selectedQR.size}
                    title={selectedQR.title}
                  />

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Perfect for printing and distributing at events, pandals,
                      and promotional materials!
                    </p>
                    <div className="flex justify-center space-x-2 text-xs text-gray-500">
                      <span>Size: {selectedQR.size}px</span>
                      <span>•</span>
                      <span>Margin: {selectedQR.margin}px</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a QR code from the list to preview</p>
                  <p className="text-sm">or generate a custom one</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">
            💡 Usage Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🎯 Event Promotion</h4>
              <ul className="space-y-1">
                <li>• Print and display at pandals</li>
                <li>• Include in event flyers</li>
                <li>• Share on social media</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📱 Easy Access</h4>
              <ul className="space-y-1">
                <li>• Visitors can scan with phones</li>
                <li>• Quick access to website</li>
                <li>• Share with friends easily</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
