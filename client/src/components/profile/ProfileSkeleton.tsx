"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Render a skeleton placeholder layout for a user profile including an avatar header, content lines, and pill-shaped tag placeholders.
 *
 * @returns A React element containing skeleton UI for a profile page: a header with circular avatar and title/subtitle placeholders, a content section with multiple line placeholders, and a tag/chip section with rounded pill placeholders.
 */
export default function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="border-border">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Skeleton */}
      <Card className="border-border">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}