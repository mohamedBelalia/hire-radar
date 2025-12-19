"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { getValidImageUrl } from "@/lib/image-utils";
import { useUploadEmployerImage } from "@/features/profile/hooks";
import { toast } from "sonner";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user?: User;
  compact?: boolean;
}

export default function ProfileHeader({
  user,
  compact = false,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadImage = useUploadEmployerImage(user?.id?.toString() || "");

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
                    e.currentTarget.style.display = "none";
                  }}
                />
                <AvatarFallback className="bg-foreground text-background text-lg font-semibold">
                  {user ? getInitials(user.full_name) : "ME"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImage.isPending}
              >
                <Camera className="h-3 w-3" />
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
                    await uploadImage.mutateAsync(file);
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
            <Button variant="outline" className="w-full" size="sm">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version for profile page - Account Settings header
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <p className="text-muted-foreground">
        Manage your account settings and preferences
      </p>
    </div>
  );
}
