"use client";

import {
  Play,
  BarChart3,
  UserPlus,
  Bookmark,
  Gamepad2,
  Settings,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import ProfileHeader from "@/app/profile/components/profile-header";

export default function LeftSidebar() {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;
  const hashtags = [
    "work",
    "business",
    "hr",
    "userinterface",
    "digital",
    "userexperience",
    "ux",
    "ui",
    "freelance",
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        {/* User Profile Card */}
        <div className="mb-4">
          <ProfileHeader user={currentUser} compact={true} />
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 mb-6">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Learning</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Insights</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Find colleagues</span>
          </a>
          <a
            href="/dashboard/candidate/saved-jobs"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            <span>Bookmarks</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Gaming</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              New
            </Badge>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>

        {/* Followed Hashtags */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">
              Followed Hashtags
            </h3>
            <button className="text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <a
                key={tag}
                href="#"
                className="px-3 py-1 bg-muted hover:bg-accent text-foreground text-sm rounded-full transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
