"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { getValidImageUrl } from "@/lib/image-utils";
import {
  useUploadCandidateImage,
  useUploadEmployerImage,
} from "@/features/profile/hooks";
import { toast } from "sonner";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user?: User;
  compact?: boolean;
  readOnly?: boolean;
}

export default function ProfileHeader({
  user,
  compact = false,
  readOnly = false,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadCandidateImage = useUploadCandidateImage(
    user?.id?.toString() || "",
  );
  const uploadEmployerImage = useUploadEmployerImage(
    user?.id?.toString() || "",
  );
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

  if (compact) {
    // Compact version for sidebar
    return (
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={getValidImageUrl(user?.image)}
                  alt={user?.full_name || "Profile"}
                  onError={(e) => {
                    // Hide image on error, show fallback
                    e.currentTarget.style.display = "none";
                  }}
                />
                <AvatarFallback className="bg-foreground text-background text-lg font-semibold">
                  {user ? getInitials(user.full_name) : "ME"}
                </AvatarFallback>
              </Avatar>
              {!readOnly && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={
                    uploadCandidateImage.isPending ||
                    uploadEmployerImage.isPending
                  }
                  aria-label="Change profile picture"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    if (user?.role === "candidate") {
                      await uploadCandidateImage.mutateAsync(file);
                    } else if (user?.role === "employer") {
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
            <div className="flex flex-col items-center gap-1 w-full">
              <h3 className="font-semibold text-sm truncate w-full text-center">
                {user?.full_name || "User"}
              </h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {user?.role || "User"}
              </Badge>
              {user?.email && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground truncate w-full justify-center">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.created_at && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              )}
            </div>
            {!readOnly && (
              <Button variant="outline" className="w-full" size="sm">
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version for public profile (Hero)
  if (readOnly) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl mb-8">
        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/5 opacity-50" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-primary blur-3xl" />
        </div>

        <CardContent className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary-foreground rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ring-2 ring-primary/20 shadow-2xl relative">
                <AvatarImage
                  src={getValidImageUrl(user?.image)}
                  alt={user?.full_name || "Profile"}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-foreground to-foreground/80 text-background font-bold">
                  {user ? getInitials(user.full_name) : "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                    {user?.full_name}
                  </h1>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 text-sm font-bold uppercase tracking-wider backdrop-blur-md">
                    {user?.role}
                  </Badge>
                </div>
                {user?.headLine && (
                  <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-snug">
                    {user.headLine}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm md:text-base text-muted-foreground/80 font-medium pt-2">
                {user?.location && (
                  <div className="flex items-center gap-2 bg-accent/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-border/50">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-accent/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-border/50">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{user?.email}</span>
                </div>
                {user?.created_at && (
                  <div className="flex items-center gap-2 bg-accent/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-border/50">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  // Full version for private profile page - Account Settings header
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <p className="text-muted-foreground">
        Manage your account settings and preferences
      </p>
    </div>
  );

}
