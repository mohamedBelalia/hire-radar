"use client";

import { Search, Bell, User, LogOut, Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getValidImageUrl } from "@/lib/image-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getToken } from "@/lib";

export default function TopNavbar() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser(getToken()!);
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/jobs/search?search=${encodeURIComponent(searchQuery.trim())}`,
      );
    } else {
      router.push("/jobs/search");
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const getInitials = (full_name: string) => {
    return full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Note: employer_id is not available from /auth/me endpoint
  // Using user.id as fallback for employer profile
  const profileUrl =
    currentUser?.role === "candidate"
      ? "/dashboard/candidate/profile"
      : currentUser?.role === "employer"
        ? "/dashboard/employer/profile"
        : "/dashboard/candidate/profile";

  // Note: candidate_id is not available from /auth/me endpoint
  // Saved jobs endpoint doesn't exist in backend yet anyway
  const savedJobsUrl =
    currentUser?.role === "candidate" ? "/dashboard/candidate/saved-jobs" : "#";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur mb-2">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          <img
            src="/radar.svg"
            alt="Hire Radar"
            width={28}
            height={28}
            className="invert dark:invert-0 border-0 bg-transparent outline-none"
            style={{ display: "block" }}
          />
          <span className="hidden sm:inline">Hire Radar</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-8"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              className="pl-9 h-9 bg-background border-border"
              aria-label="Search jobs"
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Icon - Mobile */}
          <Link
            href="/jobs/search"
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Search jobs"
          >
            <Search className="h-5 w-5" />
          </Link>

          <ThemeToggle />

          {/* Notifications - Placeholder */}
          <button
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-foreground rounded-full" />
          </button>

          {/* User Avatar Dropdown */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getValidImageUrl(currentUser.image)}
                      alt={currentUser.full_name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                      {getInitials(currentUser.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-1 w-fit text-xs capitalize"
                    >
                      {currentUser.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={profileUrl} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {currentUser.role === "candidate" && (
                  <DropdownMenuItem asChild>
                    <Link href={savedJobsUrl} className="cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Saved Jobs
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
