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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hook";
import ThemeToggle from "./ThemeToggle";

export default function TopNavbar() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();

  // Determine profile URL based on user role
  const profileUrl =
    currentUser?.role === "candidate"
      ? "/dashboard/candidate/profile"
      : currentUser?.role === "employer"
        ? "/dashboard/employer/profile"
        : "/dashboard/candidate/profile"; // Default to candidate

  const isActive = (path: string) => pathname === path;
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-50 shadow-lg dark:shadow-purple-900/10">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/radar.svg"
                alt="Hire Radar Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-purple-400">
              Hire Radar
            </span>
          </Link>

          {/* Center Navigation Icons */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`p-3 rounded-xl transition-all duration-200 group ${
                isActive("/")
                  ? "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20"
              }`}
              aria-label="Home"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <button
              className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20 rounded-xl transition-all duration-200 group"
              aria-label="Users"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <Link
              href="/jobs/search"
              className={`p-3 rounded-xl transition-all duration-200 group ${
                pathname?.startsWith("/jobs")
                  ? "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20"
              }`}
              aria-label="Jobs"
            >
              <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <button
              className="relative p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20 rounded-xl transition-all duration-200 group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                9+
              </span>
            </button>
            <button
              className="relative p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20 rounded-xl transition-all duration-200 group"
              aria-label="Messages"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                6
              </span>
            </button>
            <Link
              href={profileUrl}
              className={`p-3 rounded-xl transition-all duration-200 group ${
                pathname?.includes("/profile")
                  ? "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20"
              }`}
              aria-label="Profile"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md ml-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything (Jobs)"
                className="w-full pl-4 pr-10 py-2.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
