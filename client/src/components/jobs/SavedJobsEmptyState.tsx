"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

/**
 * Renders an empty-state UI shown when the user has no saved jobs.
 *
 * @returns A JSX element containing a centered card with a bookmark icon, heading, descriptive text, and a primary button linking to the jobs search page.
 */
export default function SavedJobsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <Card className="border-border bg-card max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            No saved jobs yet
          </h3>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t saved any jobs yet. Start exploring opportunities
            and save the ones that interest you.
          </p>
          <Button
            asChild
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href="/jobs/search">Browse Jobs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}