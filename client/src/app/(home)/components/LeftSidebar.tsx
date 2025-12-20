"use client";

import {
  Users,
  BarChart3,
  UserPlus,
  Bookmark,
  Gamepad2,
  Settings,
  Plus,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { getValidImageUrl } from "@/lib/image-utils";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConnectionRequests } from "@/features/connections/hooks";
import { getToken } from "@/lib";

function LeftSidebarContent() {
  const { data } = useCurrentUser(getToken()!);
  const currentUser = data as User | undefined;
  const { data: connectionData } = useConnectionRequests();

  const connectionsCount = currentUser
    ? (connectionData?.received?.filter((r) => r.status === "accepted")
        .length || 0) +
      (connectionData?.sent?.filter((r) => r.status === "accepted").length || 0)
    : 0;

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
    <Sidebar className="top-16 h-[calc(100svh-4rem)] border-r">
      <SidebarHeader className="border-b border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Link
                href={
                  currentUser?.role === "employer"
                    ? "/dashboard/employer/profile"
                    : "/dashboard/candidate/profile"
                }
                className="flex items-center gap-3 w-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getValidImageUrl(currentUser?.image)} />
                  <AvatarFallback className="bg-muted text-foreground font-semibold">
                    {currentUser?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentUser?.full_name || "Guest"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Welcome!
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/connections">
                    <Users />
                    <span>Connections</span>
                  </Link>
                </SidebarMenuButton>
                {connectionsCount > 0 && (
                  <SidebarMenuBadge className="bg-secondary text-secondary-foreground text-xs rounded-full px-1.5 py-0.5">
                    {connectionsCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <BarChart3 />
                    <span>Insights</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <UserPlus />
                    <span>Find colleagues</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={true}
                  className="bg-sidebar-accent text-sidebar-accent-foreground"
                >
                  <a href="/dashboard/candidate/saved-jobs">
                    <Bookmark />
                    <span>Bookmarks</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Gamepad2 />
                    <span>Gaming</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge className="bg-secondary text-secondary-foreground text-xs rounded-full px-1.5 py-0.5">
                  New
                </SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Followed Hashtags */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between w-full">
              <span>Followed Hashtags</span>
              <button className="text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 px-2">
              {hashtags.map((tag) => (
                <a
                  key={tag}
                  href="#"
                  className="px-2 py-1 bg-muted hover:bg-accent text-foreground text-xs rounded transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <div className="text-xs text-center text-muted-foreground w-full">
          © 2024 Hire Radar
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function LeftSidebar() {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      className="w-auto flex-none min-h-[calc(100vh-4rem)] hidden md:flex"
    >
      <LeftSidebarContent />
    </SidebarProvider>
  );
}
