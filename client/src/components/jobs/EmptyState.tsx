"use client";

import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export default function EmptyState({
  hasFilters,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Card className="border-border bg-card max-w-md w-full">
        <CardContent className="p-12 text-center">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            No jobs found
          </h3>
          <p className="text-muted-foreground mb-6">
            {hasFilters
              ? "Try adjusting your filters to see more results."
              : "We couldn't find any jobs matching your search. Try different keywords or check back later."}
          </p>
          {hasFilters && onClearFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="border-border"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
