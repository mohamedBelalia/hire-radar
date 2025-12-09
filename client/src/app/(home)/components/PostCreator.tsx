"use client";

import {
  Pencil,
  Image as ImageIcon,
  Video,
  Calendar,
  FileText,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/features/auth/hook";

export default function PostCreator() {
  const { data: currentUser } = useCurrentUser();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-border">
      <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={currentUser?.image || undefined}
            alt={currentUser?.full_name || "User"}
          />
          <AvatarFallback className="bg-foreground text-background font-semibold">
            {currentUser ? getInitials(currentUser.full_name) : "ME"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Write something..."
            className="mb-3 bg-background border-border"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Photo</span>
              </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Video className="w-5 h-5" />
                <span className="text-sm">Video</span>
              </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Event</span>
              </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Article</span>
              </button>
            </div>
              <Button className="bg-foreground text-background hover:bg-foreground/90">
              <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
