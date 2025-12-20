"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getToken } from "@/lib";
import { useCurrentUser } from "@/features/auth/hook";
import { logout } from "@/features/auth/api";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const token = getToken();
  const { data, isLoading } = useCurrentUser(token!);
  const router = useRouter();

  if (isLoading) return null;

  const signOutFromApp = async () => {
    logout();
    router.push(`/login`);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={data?.image || undefined}
                  alt={data?.full_name}
                />
                <AvatarFallback className="rounded-lg">
                  {data?.full_name?.charAt(0).toLocaleUpperCase()}
                  {data?.full_name
                    ?.split(" ")[1]
                    ?.charAt(0)
                    .toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data?.full_name}</span>
                <span className="truncate text-xs">{data?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={data?.image || undefined}
                    alt={data?.full_name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {data?.full_name?.charAt(0).toLocaleUpperCase()}
                    {data?.full_name && data.full_name.split(" ")[1]
                      ? data.full_name
                          .split(" ")[1]
                          .charAt(0)
                          .toLocaleUpperCase()
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {data?.full_name}
                  </span>
                  <span className="truncate text-xs">{data?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutFromApp}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
