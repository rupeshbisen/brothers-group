"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Video,
  Image as ImageIcon,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name?: string;
  file_type: string;
  category: string;
  uploader_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/gallery?status=approved");

        if (!response.ok) {
          throw new Error("Failed to fetch gallery items");
        }

        const data = await response.json();
        setGalleryItems(data.items || []);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError("Failed to load gallery items");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Keyboard navigation
  // Get unique categories from the data, with fallback for items without category
  const getCategories = () => {
    const uniqueCategories = new Set<string>();

    galleryItems.forEach(item => {
      if (item.category && item.category.trim()) {
        uniqueCategories.add(item.category);
      }
    });

    const categoryOptions = [
      { id: "all", name: "All Media" },
      ...Array.from(uniqueCategories)
        .sort()
        .map(category => ({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
        })),
    ];

    return categoryOptions;
  };

  const categories = getCategories();

  const filteredItems =
    activeTab === "all"
      ? galleryItems
      : galleryItems.filter(item => item.category === activeTab);

  const openLightbox = useCallback((item: GalleryItem) => {
    setSelectedImage(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const nextImage = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(
      item => item.id === selectedImage.id
    );
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  }, [selectedImage, filteredItems]);

  const previousImage = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(
      item => item.id === selectedImage.id
    );
    const prevIndex =
      currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    setSelectedImage(filteredItems[prevIndex]);
  }, [selectedImage, filteredItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          e.preventDefault();
          previousImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextImage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, nextImage, previousImage, closeLightbox]);

  const handleDownload = async (item: GalleryItem) => {
    try {
      const response = await fetch(item.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        item.file_name ||
        `${item.title}.${item.file_type.includes("image") ? "jpg" : "mp4"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(item.file_url, "_blank");
    }
  };

  // Only show category buttons if there are multiple categories (excluding "All Media")
  const shouldShowCategories = categories.length > 2; // More than just "All Media" and one category

  // Separate images and videos
  const images = filteredItems.filter(item =>
    item.file_type.startsWith("image")
  );
  const videos = filteredItems.filter(item =>
    item.file_type.startsWith("video")
  );

  const GalleryCard = ({ item }: { item: GalleryItem }) => (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => openLightbox(item)}
    >
      <div className="relative h-48 bg-gray-100">
        {item.file_type.startsWith("image") ? (
          <Image
            src={item.file_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              console.error("Image failed to load:", item.file_url);
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Category Badge */}
        {item.category && item.category.trim() && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            {item.category}
          </div>
        )}

        {/* Play Button for Videos */}
        {item.file_type.startsWith("video") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-lg">▶</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 h-32 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {item.title}
          </h3>
          <p
            className="text-gray-600 text-sm leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
          <span className="font-medium truncate ml-2">
            By {item.uploader_name}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Photo Gallery</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Relive the beautiful moments from our celebrations and community
            events
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs - Only show if multiple categories */}
            {shouldShowCategories && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === category.id
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading gallery items...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-red-600">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error loading gallery
                </h3>
                <p className="text-gray-600">{error}</p>
              </div>
            )}

            {/* Photo Gallery Section */}
            {!loading && !error && images.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <ImageIcon className="w-8 h-8 text-orange-600" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Photo Gallery
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map(item => (
                    <GalleryCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Video Gallery Section */}
            {!loading && !error && videos.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Video className="w-8 h-8 text-orange-600" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Video Gallery
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(item => (
                    <GalleryCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No media found
                </h3>
                <p className="text-gray-600">
                  No media available for this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[95vh] flex flex-col bg-black/20 rounded-lg overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 bg-black/80 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/80 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/80 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            {/* Media Container */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                {selectedImage.file_type.startsWith("image") ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={selectedImage.file_url}
                      alt={selectedImage.title}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-full object-contain"
                      onError={e => {
                        console.error(
                          "Image failed to load:",
                          selectedImage.file_url
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : selectedImage.file_type.startsWith("video") ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={selectedImage.file_url}
                      controls
                      autoPlay
                      className="max-w-full max-h-full object-contain"
                      onError={e => {
                        console.error(
                          "Video failed to load:",
                          selectedImage.file_url
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                    <p className="text-gray-600">
                      Unsupported file type: {selectedImage.file_type}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Media Info - Fixed at bottom */}
            <div className="w-full bg-black/90 text-white p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 truncate">
                    {selectedImage.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-1 line-clamp-2">
                    {selectedImage.description}
                  </p>
                  <p className="text-gray-400 text-xs">
                    By {selectedImage.uploader_name} •{" "}
                    {new Date(selectedImage.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    className="flex items-center gap-1 sm:gap-2 bg-gray-700 text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      handleDownload(selectedImage);
                    }}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    className="flex items-center gap-1 sm:gap-2 bg-gray-700 text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: selectedImage.title,
                          text: selectedImage.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
