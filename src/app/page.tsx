"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Image as ImageIcon,
  Heart,
  Upload,
  ArrowRight,
  Users,
  Bell,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Banner {
  id: string;
  image_url: string;
  imagekit_file_id?: string;
  is_active: boolean;
  created_at: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "event" | "donation" | "urgent";
  status: "active" | "inactive";
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Add CSS animation for announcements scroll
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-scroll {
        animation: scroll 30s linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch banners, announcements, and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersResponse, announcementsResponse, eventsResponse] =
          await Promise.all([
            fetch("/api/banners?isActive=true"),
            fetch("/api/announcements"),
            fetch("/api/events"),
          ]);

        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          setBanners(bannersData);
        }

        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          setAnnouncements(announcementsData.slice(0, 5)); // Show latest 5 announcements
        }

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          // Filter active events and sort by date
          const activeEvents = eventsData
            .filter((event: Event) => event.status === "active")
            .sort(
              (a: Event, b: Event) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 3); // Show only 3 events (one row)
          setEvents(activeEvents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prev => (prev + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const getInvolvedCards = [
    {
      id: 1,
      title: "Upload Photos",
      description:
        "Share your favorite moments from the celebration with the community",
      href: "/upload",
      buttonText: "Upload Now",
      icon: Upload,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      hoverBgColor: "group-hover:bg-orange-200",
    },
    {
      id: 2,
      title: "Make Donation",
      description:
        "Support our celebration and community activities with your contribution",
      href: "/donate",
      buttonText: "Donate Now",
      icon: Heart,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700",
      hoverBgColor: "group-hover:bg-red-200",
    },
    {
      id: 3,
      title: "Join Community",
      description:
        "Connect with fellow devotees and stay updated with all activities",
      href: "/contact",
      buttonText: "Contact Us",
      icon: Users,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
      hoverBgColor: "group-hover:bg-green-200",
    },
    {
      id: 4,
      title: "Photo Gallery",
      description: "Explore our collection of celebration photos and videos",
      href: "/gallery",
      buttonText: "View Gallery",
      icon: ImageIcon,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      hoverBgColor: "group-hover:bg-blue-200",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Ultra Compact & Engaging */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white pb-5 pt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
              Welcome to Brother Bal Ganesh Utsav Mandal
            </h1>
            <div className="mb-4">
              <p className="text-sm md:text-base text-orange-100 mb-2">
                Celebrating Ganesh Utsav with devotion and community spirit
                since 2015
              </p>
              <p className="text-sm md:text-base text-orange-100">
                Be part of our 10th year celebration and contribute to our
                community&apos;s growth and prosperity
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/events"
                className="bg-white text-orange-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center shadow-lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming Events
              </Link>
              <Link
                href="/donate"
                className="border-2 border-white text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-orange-700 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center shadow-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                Make a Donation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Banners Section - Show after hero */}
      {loading ? (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading banners...</p>
          </div>
        </section>
      ) : banners.length > 0 ? (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={banner.image_url}
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority={index === 0}
                  onError={() => {
                    console.error(
                      "Banner image failed to load:",
                      banner.image_url
                    );
                  }}
                />
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentBannerIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {/* Spacer Section with Gradient */}
      <section className="py-6 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Announcements Section - Horizontal Scrolling News Bar */}
      {loading ? (
        <section className="bg-gradient-to-r from-orange-400 to-yellow-400 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4">
              {/* Latest News Button */}
              <div className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                Latest News
              </div>

              {/* Loading State */}
              <div className="flex-1 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-black text-sm">
                    Loading announcements...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : announcements.length > 0 ? (
        <section className="bg-gradient-to-r from-orange-400 to-yellow-400 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4">
              {/* Latest News Button */}
              <div className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                Latest News
              </div>

              {/* Scrolling Announcements */}
              <div className="flex-1 overflow-hidden">
                <div className="animate-scroll whitespace-nowrap">
                  {announcements.map(announcement => (
                    <span
                      key={announcement.id}
                      className="text-black font-medium text-sm inline-block mr-8"
                    >
                      {announcement.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Journey in Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  10
                </div>
                <div className="text-gray-600 font-medium">
                  Years of Celebration
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">😊</span>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-600 font-medium">Happy Devotees</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎭</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600 font-medium">
                  Cultural Programs
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
                <div className="text-gray-600 font-medium">
                  Community Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About Our Mandal
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Brother Bal Ganesh Utsav Mandal has been serving the community
                  for over a decade, organizing cultural events, religious
                  ceremonies, and community gatherings. Our mission is to
                  preserve and promote our rich cultural heritage while
                  fostering unity and harmony among community members.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  This year marks our 10th year of celebration, and we invite
                  you to be part of this special journey. Join us in spreading
                  joy and spirituality through our annual celebrations and
                  community activities.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Users className="w-8 h-8 text-orange-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">
                      Committee Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dedicated members working for community welfare
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Our Mission</h3>
                    <p className="text-sm text-gray-600">
                      Promoting cultural values and community development
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Bell className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Latest News</h3>
                    <p className="text-sm text-gray-600">
                      Stay updated with our community announcements
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Heart className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Community</h3>
                    <p className="text-sm text-gray-600">
                      Building strong bonds through cultural activities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get Involved
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Join our celebration and be part of the community
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getInvolvedCards.map(card => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
                  >
                    <div
                      className={`w-16 h-16 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${card.hoverBgColor} transition-colors`}
                    >
                      <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className={`inline-flex items-center ${card.buttonColor} text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm`}
                    >
                      {card.buttonText}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <Link
                href="/events"
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center"
              >
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton for events
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="w-20 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-3/4 h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      <div className="w-32 h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : events.length > 0 ? (
                events.map(event => (
                  <div
                    key={event.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                          {event.category}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-orange-500">📍</span>
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Check back soon for exciting events!
                  </p>
                  <Link
                    href="/events"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View all events →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
