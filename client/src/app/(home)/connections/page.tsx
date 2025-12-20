"use client";

import { useConnections } from "@/features/connections/hooks";
import { ConnectionCard } from "./components/ConnectionCard";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ConnectionsPage() {
  const { data: connections, isLoading, isError } = useConnections();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading your professional network...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Users className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load your connections. Please try again later.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const hasConnections = connections && connections.length > 0;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between border-b pb-6 border-border/50">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Your Connections
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your professional network and stay in touch.
            </p>
          </div>
          {hasConnections && (
            <div className="bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
              <span className="text-sm font-semibold text-primary">
                {connections.length}{" "}
                {connections.length === 1 ? "Connection" : "Connections"}
              </span>
            </div>
          )}
        </div>

        {hasConnections ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6 text-center py-12 bg-accent/20 rounded-3xl border-2 border-dashed border-border/50">
            <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-bold">No connections yet</h2>
              <p className="text-muted-foreground">
                Start growing your network by connecting with employers and
                other professionals.
              </p>
            </div>
            <Button asChild className="px-8 shadow-lg shadow-primary/20">
              <Link href="/">Discover People</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
