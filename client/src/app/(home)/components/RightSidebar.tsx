"use client";

import { MessageCircle, ChevronUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SuggestedPerson } from "@/types";

import { useRandomEmployers } from "@/features/employers/hooks";
import { useRandomCandidates } from "@/features/candidates/hooks";
import { useSendConnectionRequest } from "@/features/connections/hooks";
import { getValidImageUrl } from "@/lib/image-utils";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hook";
import { getToken } from "@/lib";

function RightSidebarContent() {
  const token = getToken();
  const { data: user } = useCurrentUser(token || "");
  const isEmployer = user?.role === "employer";

  const employersQuery = useRandomEmployers();
  const candidatesQuery = useRandomCandidates();

  const suggestedPeople = (
    isEmployer ? candidatesQuery.data : employersQuery.data
  ) as SuggestedPerson[] | undefined;
  const isLoading = isEmployer
    ? candidatesQuery.isLoading
    : employersQuery.isLoading;

  const sendRequest = useSendConnectionRequest();
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  const handleConnect = async (id: number) => {
    setPendingIds((prev) => [...prev, id]);
    try {
      await sendRequest.mutateAsync(id);
    } catch {
      setPendingIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  return (
    <Sidebar side="right" className="top-16 h-[calc(100svh-4rem)] border-l">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="relative p-4 rounded-lg bg-card border border-border">
          <h3 className="font-semibold text-lg mb-1">Try Premium for free</h3>
          <p className="text-sm text-muted-foreground mb-4">One month free</p>
          <Button className="bg-foreground text-background hover:bg-foreground/90 w-full">
            Try free
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* People You May Know */}
        <SidebarGroup>
          <SidebarGroupLabel>People you may know</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-4 pt-2">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : suggestedPeople?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-4">
                  No suggestions available
                </p>
              ) : (
                suggestedPeople?.map((person: SuggestedPerson) => (
                  <div key={person.id} className="flex items-center gap-3 px-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getValidImageUrl(person.image)} />
                      <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
                        {person.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {person.full_name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {person.company_name ||
                          person.headline ||
                          person.role ||
                          "User"}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleConnect(person.id)}
                      disabled={
                        pendingIds.includes(person.id) || sendRequest.isPending
                      }
                    >
                      {pendingIds.includes(person.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
            <a
              href="#"
              className="block text-center text-xs text-muted-foreground hover:text-foreground mt-4"
            >
              See All
            </a>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Skills/Interests - Simplified as Menu Items */}
        <SidebarGroup>
          <SidebarGroupLabel>Your Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto py-2">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-sm font-medium block truncate">
                        UX Design
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto py-2">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded bg-muted flex-shrink-0" />
                    <div className="flex-1 flex justify-between items-center min-w-0">
                      <span className="text-sm font-medium truncate">
                        UI Design
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0 ml-2"
                      >
                        +99
                      </Badge>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto py-2">
                  <div className="flex items-center gap-2 w-full text-muted-foreground">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Add new page</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-sm">Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              6
            </Badge>
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function RightSidebar() {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
      className="w-auto flex-none min-h-[calc(100vh-4rem)] hidden lg:flex"
    >
      <RightSidebarContent />
    </SidebarProvider>
  );
}
