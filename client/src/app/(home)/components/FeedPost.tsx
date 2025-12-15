"use client";

import {
  ThumbsUp,
  MessageCircle,
  Send,
  Bookmark,
  Mic,
  Smile,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/features/auth/hook";

interface FeedPostProps {
  author: {
    name: string;
    title: string;
    avatar: string;
    avatarUrl?: string | null;
  };
  title: string;
  content?: React.ReactNode;
  likes: number;
  comments: number;
}

export default function FeedPost({
  author,
  title,
  content,
  likes,
  comments,
}: FeedPostProps) {
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
        {/* Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  author.avatarUrl && author.avatarUrl.trim() !== ""
                    ? author.avatarUrl
                    : undefined
                }
                alt={author.name}
              />
              <AvatarFallback className="bg-foreground text-background font-semibold">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{author.name}</h3>
              <p className="text-xs text-muted-foreground">{author.title}</p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Post Title */}
        <h2 className="font-semibold text-lg mb-3">{title}</h2>

        {/* Post Content */}
        {content && <div className="mb-4">{content}</div>}

        {/* Post Actions */}
        <div className="flex items-center gap-6 mb-3 pb-3 border-b border-border">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm">+{likes}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Send className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Comment Input */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                currentUser?.image && currentUser.image.trim() !== "" && currentUser.image !== "null" && currentUser.image !== "undefined"
                  ? currentUser.image
                  : undefined
              }
              alt={currentUser?.full_name || "User"}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
              {currentUser ? getInitials(currentUser.full_name) : "ME"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background">
            <Input
              type="text"
              placeholder="Write a comment"
              className="flex-1 border-0 bg-transparent outline-none text-sm p-0 h-auto focus-visible:ring-0"
            />
            <button className="text-muted-foreground hover:text-foreground">
              <Mic className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
