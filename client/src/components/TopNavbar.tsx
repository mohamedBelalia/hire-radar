"use client";

import { Search, Bell, User, LogOut, Bookmark, Check, X, Clock } from "lucide-react";
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
import { useNotifications, useMarkNotificationRead } from "@/features/notifications/hooks";
import { useAcceptConnection, useRejectConnection, useConnectionRequests } from "@/features/connections/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TopNavbar() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser(getToken()!);
  const { data: notifications } = useNotifications();
  const { data: connectionRequests } = useConnectionRequests();
  const markRead = useMarkNotificationRead();
  const acceptConnection = useAcceptConnection();
  const rejectConnection = useRejectConnection();

  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications?.filter(n => n.is_read === 0).length || 0;

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

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const displayNotifications = notifications?.filter(notif => {
    // Keep all unread notifications
    if (notif.is_read === 0) return true;

    // For read notifications, only keep pending connection requests
    if (notif.type === "connection_request") {
      const senderId = notif.sender_id || notif.sender?.id;
      return connectionRequests?.received.some(r =>
        Number(r.sender?.id) === Number(senderId) && r.status === "pending"
      );
    }

    return false;
  }) || [];

  const profileUrl =
    currentUser?.role === "candidate"
      ? "/dashboard/candidate/profile"
      : currentUser?.role === "employer"
        ? "/dashboard/employer/profile"
        : "/dashboard/candidate/profile";

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

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 rounded-md hover:bg-accent transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-foreground text-background text-[10px] flex items-center justify-center font-bold rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="text-[10px] py-0">
                    {unreadCount} New
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {displayNotifications.length > 0 ? (
                displayNotifications.slice(0, 10).map((notif) => {
                  // Find related request if it's a connection request
                  const senderId = notif.sender_id || notif.sender?.id;
                  const relatedReq = notif.type === "connection_request" && senderId
                    ? connectionRequests?.received.find(r => Number(r.sender?.id) === Number(senderId) && r.status === "pending")
                    : null;

                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-3 text-sm transition-colors",
                        notif.is_read === 0 ? "bg-accent/40" : "opacity-75"
                      )}
                      onMouseEnter={() => notif.is_read === 0 && markRead.mutate(notif.id)}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notif.sender?.image || undefined} />
                          <AvatarFallback>{notif.sender?.full_name?.charAt(0) || "N"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium leading-none">{notif.title}</p>
                          <p className="text-xs text-muted-foreground leading-snug">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(notif.created_at)}
                          </div>

                          {/* Connection Request Actions */}
                          {relatedReq && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="h-7 px-2 text-[11px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  acceptConnection.mutate(relatedReq.id);
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rejectConnection.mutate(relatedReq.id);
                                }}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
