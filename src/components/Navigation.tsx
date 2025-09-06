"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Upload,
  Settings,
} from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Users },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/donate", label: "Donate", icon: Heart },
    { href: "/contact", label: "Contact", icon: MessageCircle },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Brother Bal Ganesh Utsav Mandal"
                width={80}
                height={80}
                className="rounded-full"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-medium transition-colors flex items-center space-x-1 ${
                      isActive(item.href)
                        ? "text-orange-600 border-b-2 border-orange-600 pb-1"
                        : "text-gray-700 hover:text-orange-600"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Brother Bal Ganesh Utsav Mandal"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-orange-600">Menu</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-2 px-4">
              {navigationItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-orange-600 bg-orange-50 border-r-4 border-orange-600"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>Brother Bal Ganesh</p>
              <p>Utsav Mandal</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
