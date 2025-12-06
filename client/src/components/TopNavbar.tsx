"use client";

import {
  Home,
  Users,
  Briefcase,
  Bell,
  MessageCircle,
  User,
  Search,
} from "lucide-react";
import Image from "next/image";

export default function TopNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/radar.svg"
                alt="Hire Radar Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <span className="text-2xl font-bold text-purple-600">
              Hire Radar
            </span>
          </div>

          {/* Center Navigation Icons */}
          <div className="flex items-center gap-6">
            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Briefcase className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                9+
              </span>
            </button>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                6
              </span>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md ml-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything (Jobs)"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
