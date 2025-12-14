"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Search,
  Briefcase,
  FileText,
  Filter,
  Calendar,
  MapPin,
  TrendingUp,
  Settings,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";

interface SavedJobsSidebarProps {
  savedJobsCount?: number;
}

/**
 * Client-side React sidebar for the candidate "Saved Jobs" dashboard.
 *
 * Renders a profile summary (avatar, name, role), statistics (including a badge for saved jobs),
 * navigation links with an active state, quick actions, filter buttons (placeholders), and an
 * account settings link.
 *
 * @param savedJobsCount - Number displayed for "Saved Jobs" in the Statistics section; defaults to 0.
 * @returns The sidebar JSX element for the saved-jobs dashboard. 
 */
export default function SavedJobsSidebar({
  savedJobsCount = 0,
}: SavedJobsSidebarProps) {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    {
      icon: Bookmark,
      label: "Saved Jobs",
      href: "/dashboard/candidate/saved-jobs",
      active: pathname === "/dashboard/candidate/saved-jobs",
    },
    {
      icon: Search,
      label: "Search Jobs",
      href: "/jobs/search",
      active: false,
    },
    {
      icon: Briefcase,
      label: "My Applications",
      href: "#",
      active: false,
    },
    {
      icon: FileText,
      label: "Applications",
      href: "#",
      active: false,
    },
  ];

  const quickActions = [
    {
      icon: TrendingUp,
      label: "Recommended Jobs",
      href: "/",
      description: "Based on your profile",
    },
    {
      icon: Calendar,
      label: "Recent Searches",
      href: "#",
      description: "View your search history",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    currentUser?.image && currentUser.image.trim() !== ""
                      ? currentUser.image
                      : undefined
                  }
                  alt={currentUser?.full_name || "Profile"}
                />
                <AvatarFallback className="text-2xl bg-foreground text-background">
                  {currentUser ? getInitials(currentUser.full_name) : "JD"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {currentUser?.full_name || "User"}
              </h3>
              <Badge variant="secondary" className="capitalize">
                {currentUser?.role || "User"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Statistics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Saved Jobs
                </span>
              </div>
              <Badge variant="outline" className="font-semibold">
                {savedJobsCount}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Applications
                </span>
              </div>
              <Badge variant="outline" className="font-semibold">
                0
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Navigation
          </h4>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? "bg-accent text-foreground"
                      : "text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Quick Actions
          </h4>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col gap-1 px-3 py-2.5 rounded-lg transition-colors hover:bg-accent/50 group"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {action.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Filters
          </h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Implement filter functionality
                console.log("Filter by date");
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Sort by Date
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Implement filter functionality
                console.log("Filter by location");
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Filter by Location
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Implement filter functionality
                console.log("Show all filters");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Account Link */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <Link
            href="/dashboard/candidate/profile"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-accent/50 text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}