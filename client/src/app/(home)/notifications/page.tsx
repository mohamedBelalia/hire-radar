"use client";

import { useMemo } from "react";
import TopNavbar from "@/components/TopNavbar";
import { useNotifications, useMarkNotificationRead } from "@/features/notifications/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString();
};

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unreadCount = useMemo(
    () => (notifications || []).filter((n) => n.is_read === 0).length,
    [notifications],
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-5xl pt-24 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Notifications</p>
            <h1 className="text-3xl font-bold leading-tight">Stay on top of what matters</h1>
            <p className="text-sm text-muted-foreground">
              Applications, connection requests, and job updates will appear here.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {unreadCount} unread
          </Badge>
        </div>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading notifications...</div>
            ) : isError ? (
              <div className="p-6 text-sm text-destructive">Failed to load notifications.</div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/40">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="font-semibold">No notifications yet</p>
                <p className="text-sm">You’ll see job applications, requests, and updates here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-4 md:p-5 flex gap-3 md:gap-4 items-start hover:bg-accent/40 transition-colors",
                      notif.is_read === 0 ? "bg-accent/30" : "bg-transparent",
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notif.sender?.image || undefined} />
                      <AvatarFallback className="bg-foreground text-background text-xs">
                        {(notif.sender?.full_name || "N").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{notif.title}</span>
                        {notif.type && (
                          <Badge variant="outline" className="text-[11px] capitalize">
                            {notif.type.replace("_", " ")}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground wrap-break-words">{notif.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {notif.is_read === 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markRead.mutate(notif.id)}
                          disabled={markRead.isPending}
                          className="text-xs"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />
      </div>
    </div>
  );
}

