"use client";

import { Calendar, MessageCircle, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    SidebarMenuBadge,
    SidebarSeparator,
    SidebarProvider,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";

function RightSidebarContent() {
    const suggestedPeople = [
        { name: "Steve Jobs", title: "CEO of Apple", avatar: "SJ" },
        { name: "Ryan Roslansky", title: "CEO of Linkedin", avatar: "RR" },
        { name: "Dylan Field", title: "CEO of Figma", avatar: "DF" },
    ];

    return (
        <Sidebar side="right" className="top-16 h-[calc(100svh-4rem)] border-l">
            <SidebarHeader className="p-4 border-b border-border">
                <div className="relative p-4 rounded-lg bg-card border border-border">
                    <h3 className="font-semibold text-lg mb-1">Try Premium for free</h3>
                    <p className="text-sm text-muted-foreground mb-4">One month free</p>
                    <Button className="bg-foreground text-background hover:bg-foreground/90 w-full">
                        Try free
                    </Button>
                    <Calendar className="absolute bottom-2 right-2 w-12 h-12 text-muted-foreground opacity-20" />
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                {/* People You May Know */}
                <SidebarGroup>
                    <SidebarGroupLabel>People you may know</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="space-y-4 pt-2">
                            {suggestedPeople.map((person, index) => (
                                <div key={index} className="flex items-center gap-3 px-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
                                            {person.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">
                                            {person.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {person.title}
                                        </p>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
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
                                        <span className="text-sm font-medium">UX Design</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="h-auto py-2">
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="w-8 h-8 rounded bg-muted flex-shrink-0" />
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-medium">UI Design</span>
                                            <Badge variant="secondary" className="text-xs">+99</Badge>
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