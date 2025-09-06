"use client";

import {
  Star,
  Award,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function AboutPage() {
  const achievements = [
    {
      year: "2025",
      title: "10th Anniversary Celebration & Digital Transformation",
      description:
        "Successfully completed a decade of community service with grand celebrations and launched comprehensive digital platforms including website, donation system, and online gallery management.",
    },
    {
      year: "2024",
      title: "Digital Excellence & Community Outreach",
      description:
        "Achieved digital transformation with comprehensive website development, online donation system, and expanded community outreach programs reaching 500+ families.",
    },
    {
      year: "2023",
      title: "Best Community Organization Award",
      description:
        "Recognized by the Municipal Corporation for outstanding community service, cultural preservation, and contributions to local development initiatives.",
    },
    {
      year: "2022",
      title: "Cultural Excellence Award & Youth Engagement",
      description:
        "Awarded for promoting traditional cultural activities and values, plus successful launch of youth engagement programs and cultural workshops.",
    },
    {
      year: "2021",
      title: "Community Development Award & Pandemic Support",
      description:
        "Recognized for contributions to local community development and exceptional support during the pandemic with virtual celebrations and community welfare programs.",
    },
    {
      year: "2020",
      title: "Pandemic Adaptation & Digital Innovation",
      description:
        "Successfully adapted to the pandemic with virtual Ganesh Utsav celebrations, online community programs, and digital prayer sessions, maintaining community spirit during challenging times.",
    },
    {
      year: "2019",
      title: "Community Expansion & Cultural Programs",
      description:
        "Expanded community reach to 400+ families and launched regular cultural programs, music classes, and traditional art workshops for all age groups.",
    },
    {
      year: "2018",
      title: "Regional Recognition & Infrastructure Development",
      description:
        "Gained regional recognition as a leading community organization and completed infrastructure development including community hall renovation and cultural center setup.",
    },
    {
      year: "2017",
      title: "Community Growth & Welfare Initiatives",
      description:
        "Achieved significant community growth with 300+ member families and launched comprehensive welfare initiatives including educational support and health camps.",
    },
    {
      year: "2016",
      title: "Cultural Program Launch & Committee Strengthening",
      description:
        "Successfully launched first major cultural program and strengthened committee structure with dedicated teams for different activities and community engagement.",
    },
    {
      year: "2015",
      title: "Foundation & First Ganesh Utsav",
      description:
        "Successfully established Brother Bal Ganesh Utsav Mandal and organized the first Ganesh Utsav celebration with 50+ families, setting the foundation for community unity.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Our Mandal
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Serving the community with devotion and dedication since 2015
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              History & Purpose
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Our Journey
                </h3>
                <p className="text-gray-600 mb-6">
                  Brother Bal Ganesh Utsav Mandal was established in 2015 with a
                  vision to bring the community together through religious and
                  cultural celebrations. What started as a small gathering has
                  now grown into one of the most respected community
                  organizations in the region.
                </p>
                <p className="text-gray-600 mb-6">
                  Over the past decade, we have successfully organized numerous
                  Ganesh Utsav celebrations, cultural programs, and community
                  welfare activities. Our commitment to preserving traditional
                  values while embracing modern community development has made
                  us a trusted name in the community.
                </p>
                <div className="flex items-center text-orange-600 font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Established in 2015
                </div>
              </div>
              <div className="bg-orange-50 p-8 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Our Values
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Heart className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">
                      Devotion and Spirituality
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Heart className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Community Unity</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Cultural Preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Excellence in Service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Our Journey Through Time
            </h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              From humble beginnings to becoming a cornerstone of community
              celebration and cultural preservation
            </p>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-orange-300 h-full hidden lg:block"></div>

              <div className="space-y-12">
                {/* 2025 - 10th Year Celebration */}
                <div className="relative flex items-center">
                  <div className="lg:w-1/2 lg:pr-8 lg:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500 lg:border-l-0 lg:border-r-4">
                      <div className="flex items-center justify-between lg:justify-end mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          10th Year Celebration
                        </h3>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          2025
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Celebrating a decade of community service, cultural
                        preservation, and spiritual growth with grand
                        festivities and special programs.
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          Special Events:
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Grand 10th Anniversary Ganesh Utsav</li>
                          <li>• Special cultural programs and performances</li>
                          <li>• Community recognition ceremony</li>
                          <li>• Launch of comprehensive website</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  <div className="lg:w-1/2 lg:pl-8">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Heart className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                          <p className="text-orange-800 font-semibold">
                            10 Years Strong
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2024 - Digital Excellence */}
                <div className="relative flex items-center">
                  <div className="lg:w-1/2 lg:pr-8 lg:text-right">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Star className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                          <p className="text-blue-800 font-semibold">
                            Digital Excellence
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  <div className="lg:w-1/2 lg:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          Digital Excellence
                        </h3>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          2024
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Achieved digital excellence with comprehensive online
                        presence, donation system, and community engagement
                        platforms.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          Digital Achievements:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Comprehensive website development</li>
                          <li>• Online donation system</li>
                          <li>• Gallery and event management</li>
                          <li>• Social media expansion</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2022 - Recognition & Awards */}
                <div className="relative flex items-center">
                  <div className="lg:w-1/2 lg:pr-8 lg:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500 lg:border-l-0 lg:border-r-4">
                      <div className="flex items-center justify-between lg:justify-end mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          Recognition & Awards
                        </h3>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          2022
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Received prestigious recognition for outstanding
                        community service and cultural preservation efforts.
                      </p>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">
                          Awards & Recognition:
                        </h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Best Community Organization Award</li>
                          <li>• Cultural Excellence Recognition</li>
                          <li>• Municipal Corporation Appreciation</li>
                          <li>• Community Service Excellence</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  <div className="lg:w-1/2 lg:pl-8">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Award className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                          <p className="text-purple-800 font-semibold">
                            Awards & Recognition
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2020 - Pandemic Adaptation */}
                <div className="relative flex items-center">
                  <div className="lg:w-1/2 lg:pr-8 lg:text-right">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Heart className="w-12 h-12 text-green-600 mx-auto mb-2" />
                          <p className="text-green-800 font-semibold">
                            Pandemic Adaptation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  <div className="lg:w-1/2 lg:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          Pandemic Adaptation
                        </h3>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          2020
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Successfully adapted to the pandemic with innovative
                        online celebrations and community support initiatives.
                      </p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">
                          Adaptations:
                        </h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Virtual Ganesh Utsav celebrations</li>
                          <li>• Online community programs</li>
                          <li>• Digital prayer sessions</li>
                          <li>• Community support during lockdown</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2018 - Community Expansion */}
                <div className="relative flex items-center">
                  <div className="lg:w-1/2 lg:pr-8 lg:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500 lg:border-l-0 lg:border-r-4">
                      <div className="flex items-center justify-between lg:justify-end mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          Community Expansion
                        </h3>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          2018
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Significant expansion in community reach and influence,
                        becoming a recognized organization in the region.
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          Expansion:
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• 300+ member families</li>
                          <li>• Regular cultural programs</li>
                          <li>• Community welfare activities</li>
                          <li>• Youth engagement programs</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  <div className="lg:w-1/2 lg:pl-8">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Star className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                          <p className="text-orange-800 font-semibold">
                            Community Growth
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2015 - The Beginning */}
                <div className="relative flex items-center">
                  <div className="lg:w-1/2 lg:pr-8 lg:text-right">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                          <p className="text-orange-800 font-semibold">
                            First Celebration
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  <div className="lg:w-1/2 lg:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          The Beginning
                        </h3>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          2015
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Started as a small group of devotees with a vision to
                        bring the community together through Ganesh Utsav
                        celebrations.
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          First Steps:
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• First Ganesh Utsav celebration</li>
                          <li>• Community gathering of 50+ families</li>
                          <li>• Establishment of basic committee structure</li>
                          <li>• Setting up community hall</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Our Mission & Vision
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Star className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To organize and promote religious and cultural activities that
                  strengthen community bonds, preserve our rich cultural
                  heritage, and contribute to the overall development of society
                  through spiritual and social initiatives.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  To become a leading community organization that inspires
                  unity, promotes cultural values, and serves as a model for
                  community development through religious harmony and social
                  welfare activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Achievements
            </h2>
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {achievement.title}
                        </h3>
                        <span className="text-orange-600 font-semibold">
                          {achievement.year}
                        </span>
                      </div>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <MapPin className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Address
                </h3>
                <p className="text-gray-600">
                  Gangabagh, Pardi
                  <br />
                  Nagpur 440035
                  <br />
                  Maharashtra, India
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Phone
                </h3>
                <p className="text-gray-600">
                  <a
                    href="tel:+918408889448"
                    className="hover:text-orange-600 transition-colors"
                  >
                    +91 84088 89448
                  </a>
                </p>
                <p className="text-gray-600">
                  <a
                    href="tel:+918767723336"
                    className="hover:text-orange-600 transition-colors"
                  >
                    +91 87677 23336
                  </a>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email
                </h3>
                <p className="text-gray-600">info@brothersbalganesh.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
