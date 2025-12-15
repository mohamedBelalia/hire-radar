"use client";

import { Calendar, MessageCircle, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * Render a fixed right sidebar with a premium offer, suggested people, skills/interests, and a messages widget.
 *
 * The sidebar is positioned on the right edge and contains four cards: a Premium call-to-action, a
 * "People you may know" list generated from an internal array, a Skills/Interests list with actions,
 * and a Messages widget anchored near the bottom-right.
 *
 * @returns An aside JSX element containing the sidebar and its child widgets
 */
export default function RightSidebar() {
  const suggestedPeople = [
    { name: "Steve Jobs", title: "CEO of Apple", avatar: "SJ" },
    { name: "Ryan Roslansky", title: "CEO of Linkedin", avatar: "RR" },
    { name: "Dylan Field", title: "CEO of Figma", avatar: "DF" },
  ];

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-80 bg-card border-l border-border overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Premium Widget */}
        <Card className="border-border">
          <CardContent className="p-4 relative">
            <h3 className="font-semibold text-lg mb-1">Try Premium for free</h3>
            <p className="text-sm text-muted-foreground mb-4">One month free</p>
            <Button className="bg-foreground text-background hover:bg-foreground/90">
              Try free
            </Button>
            <Calendar className="absolute bottom-2 right-2 w-12 h-12 text-muted-foreground opacity-20" />
          </CardContent>
        </Card>

        {/* People You May Know */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>People you may know:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestedPeople.map((person, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-foreground text-background font-semibold text-sm">
                      {person.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {person.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {person.title}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-foreground text-background hover:bg-foreground/90 whitespace-nowrap"
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="block text-center text-sm text-foreground hover:text-foreground/80 mt-4"
            >
              See All
            </a>
          </CardContent>
        </Card>

        {/* Skills/Interests */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-muted" />
                  <span className="text-sm font-medium">UX Design</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-muted" />
                  <span className="text-sm font-medium">UI Design</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +99
                </Badge>
              </div>
              <a
                href="#"
                className="flex items-center gap-2 text-foreground hover:text-foreground/80 text-sm p-2"
              >
                <span className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
                  +
                </span>
                <span>Add new page</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Messages Widget */}
        <Card className="fixed bottom-4 right-4 w-72 border-border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-sm">Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  6
                </Badge>
                <button className="text-muted-foreground hover:text-foreground">
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}