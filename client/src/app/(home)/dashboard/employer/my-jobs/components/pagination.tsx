"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              className="w-10 h-10 p-0"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isLoading}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
