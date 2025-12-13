"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Card className="border-border bg-card max-w-md w-full">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-muted-foreground mb-6">
            {message || "Failed to load profile. Please try again."}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
