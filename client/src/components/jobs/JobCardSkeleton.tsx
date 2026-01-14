import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a skeleton placeholder for a job card layout.
 *
 * @returns A JSX element containing a Card with Skeleton placeholders for the title, subtitle, descriptive lines, metadata/badges, and footer action areas.
 */
export default function JobCardSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6 flex items-center gap-3 border-t border-border">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}