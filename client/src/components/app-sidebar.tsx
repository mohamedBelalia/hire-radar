"use client"

import * as React from "react"
import {
  Brain,
  BriefcaseBusiness,
  ChartBar,
  Contact,
  HelpCircle,
  LayoutDashboard,
  Map,
  PieChart,
  Users,
  UserStar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavSettings } from "./nav-settings"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Stats",
      url: "/admin/stats",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Users list",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Posted jobs",
      url: "/admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Skills",
      url: "/admin/skills",
      icon: Brain,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: ChartBar,
    },
  ],
  settings: [
    {
      name: "Admins",
      url: "/admin/admins",
      icon: UserStar,
    },
    {
      name: "Help",
      url: "/help",
      icon: HelpCircle,
    },
    {
      name: "Contact",
      url: "/contact",
      icon: Contact,
    },
  ],
}

/**
 * Render the application sidebar including branding, main navigation, settings, and the user area.
 *
 * @param props - Props to forward to the underlying Sidebar component (e.g., className, style, or other Sidebar-specific props).
 * @returns The sidebar element composed of a header with logo/brand, main navigation, settings section, and footer user area.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image width={25} height={25} alt="hire-radar logo" src={'/radar.svg'}/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Hire-radar</span>
                  <span className="truncate text-xs">Entreprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings settings={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}