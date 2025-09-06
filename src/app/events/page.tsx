"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Filter,
  Search,
  X,
} from "lucide-react";
import { SuccessModal } from "@/components/Modal";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
  created_at: string;
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchEvents();
    // Load registered events from localStorage
    const saved = localStorage.getItem("registeredEvents");
    if (saved) {
      setRegisteredEvents(JSON.parse(saved));
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Separate upcoming and past events based on date and status
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today && event.status === "active";
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate < today || event.status === "inactive";
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Recent first

  const allEvents = [...upcomingEvents, ...pastEvents];
  const filteredEvents = allEvents.filter(event => {
    const isUpcoming = upcomingEvents.some(e => e.id === event.id);
    const isPast = pastEvents.some(e => e.id === event.id);

    const matchesTab =
      (activeTab === "upcoming" && isUpcoming) ||
      (activeTab === "past" && isPast);

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  // Handle Register Interest
  const handleRegisterInterest = (eventId: string) => {
    const newRegisteredEvents = [...registeredEvents, eventId];
    setRegisteredEvents(newRegisteredEvents);
    localStorage.setItem(
      "registeredEvents",
      JSON.stringify(newRegisteredEvents)
    );

    // Show success modal
    setSuccessMessage(
      "Thank you for registering your interest! We will keep you updated."
    );
    setShowSuccessModal(true);
  };

  // Check if event is registered
  const isEventRegistered = (eventId: string) => {
    return registeredEvents.includes(eventId);
  };

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(events.map(event => event.category))),
  ];

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isUpcomingEvent = (event: Event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today && event.status === "active";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Events & Programs
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Join us in celebrating our cultural heritage and community spirit
            through various events and programs
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      showFilters
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Filter</span>
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-orange-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {category === "all" ? "All Categories" : category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "upcoming"
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "past"
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Past Events
              </button>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.category === "Religious"
                            ? "bg-orange-100 text-orange-800"
                            : event.category === "Cultural"
                              ? "bg-blue-100 text-blue-800"
                              : event.category === "Community"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {event.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isUpcomingEvent(event)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isUpcomingEvent(event) ? "Upcoming" : "Past"}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 mt-auto">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(event.time)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  {isUpcomingEvent(event) && (
                    <div className="px-6 py-3 bg-orange-50 border-t border-gray-200">
                      {isEventRegistered(event.id) ? (
                        <button
                          disabled
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center cursor-not-allowed"
                        >
                          <Heart className="w-4 h-4 mr-2 fill-current" />
                          Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterInterest(event.id)}
                          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Register Interest
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search terms or filters."
                    : "Check back later for upcoming events."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Schedule Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Event Schedule
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Ganesh Utsav 2025 Schedule
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, index) => (
                      <div
                        key={event.id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.date)} • {formatTime(event.time)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No upcoming events scheduled at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Registration Successful!"
        message={successMessage}
        confirmText="Great!"
      />
    </div>
  );
}
