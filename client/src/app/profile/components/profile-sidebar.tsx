"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserIcon,
  Lock,
  Bell,
  Settings,
  Bookmark,
  FileText,
  Briefcase,
  Mail,
  Calendar,
  MapPin,
  Camera,
} from "lucide-react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hook";
import { getValidImageUrl } from "@/lib/image-utils";
import {
  useUploadCandidateImage,
  useUploadEmployerImage,
} from "@/features/profile/hooks";
import { toast } from "sonner";
import type { User } from "@/types";

export default function ProfileSidebar() {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadCandidateImage = useUploadCandidateImage(
    currentUser?.id?.toString() || "",
  );
  const uploadEmployerImage = useUploadEmployerImage(
    currentUser?.id?.toString() || "",
  );
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const navItems = [
    {
      icon: UserIcon,
      label: "Profile",
      href: "#profile",
      tab: "profile",
    },
    {
      icon: Lock,
      label: "Security",
      href: "#security",
      tab: "security",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "#notifications",
      tab: "notifications",
    },
  ];

  const quickLinks = [
    {
      icon: Bookmark,
      label: "Saved Jobs",
      href: "/dashboard/candidate/saved-jobs",
      visible: currentUser?.role === "candidate",
    },
    {
      icon: Briefcase,
      label: "My Applications",
      href: "#",
      visible: currentUser?.role === "candidate",
    },
    {
      icon: FileText,
      label: "My Jobs",
      href: "#",
      visible: currentUser?.role === "employer",
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
                  src={getValidImageUrl(currentUser?.image)}
                  alt={currentUser?.full_name || "Profile"}
                  onError={(e) => {
                    // Hide image on error, show fallback
                    e.currentTarget.style.display = "none";
                  }}
                />
                <AvatarFallback className="text-2xl bg-foreground text-background">
                  {currentUser ? getInitials(currentUser.full_name) : "JD"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -right-2 -bottom-2 h-7 w-7 rounded-full"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  uploadCandidateImage.isPending ||
                  uploadEmployerImage.isPending
                }
                aria-label="Change profile picture"
              >
                <Camera className="h-3.5 w-3.5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    if (currentUser?.role === "candidate") {
                      await uploadCandidateImage.mutateAsync(file);
                    } else if (currentUser?.role === "employer") {
                      await uploadEmployerImage.mutateAsync(file);
                    } else {
                      throw new Error("Unknown role");
                    }
                    toast.success("Profile photo updated");
                  } catch {
                    toast.error("Failed to update photo");
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {currentUser?.full_name || "User"}
              </h3>
              <Badge variant="secondary" className="capitalize">
                {currentUser?.role || "User"}
              </Badge>
            </div>
            {currentUser?.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{currentUser.email}</span>
              </div>
            )}
            {currentUser?.created_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(currentUser.created_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Settings
          </h4>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.tab}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-accent/50 text-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    // Trigger tab change via URL hash
                    window.location.hash = item.tab;
                    // Dispatch custom event for tab switching
                    window.dispatchEvent(
                      new CustomEvent("tab-change", { detail: item.tab }),
                    );
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Quick Links */}
        {quickLinks.some((link) => link.visible) && (
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
              Quick Links
            </h4>
            <nav className="space-y-1">
              {quickLinks
                .filter((link) => link.visible)
                .map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-accent/50 text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Account
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                Active
              </Badge>
            </div>
            <Separator />
            <Link
              href="/dashboard/candidate/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-accent/50 text-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
