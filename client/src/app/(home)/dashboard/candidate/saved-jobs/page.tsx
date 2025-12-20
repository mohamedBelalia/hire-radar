"use client";

import { useCurrentUser } from "@/features/auth/hook";
import { useSavedJobs, useUnsaveJob } from "@/features/jobs/hooks";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import TopNavbar from "@/components/TopNavbar";
import SavedJobsSidebar from "./components/saved-jobs-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SavedJobsPage() {
  const { data: currentUser } = useCurrentUser();
  // Note: candidate_id is not available from /auth/me endpoint
  // Using user.id as fallback, but saved jobs endpoint doesn't exist in backend yet
  const candidateId = currentUser?.candidate_id || currentUser?.id;

  const {
    data: savedJobs,
    isLoading,
    isError,
  } = useSavedJobs(candidateId || 0);

  const unsaveMutation = useUnsaveJob();

  const handleUnsave = async (jobId: number) => {
    try {
      await unsaveMutation.mutateAsync(jobId);
      toast.success("Job removed from saved");
    } catch {
      toast.error("Failed to unsave job. Please try again.");
    }
  };

  if (!currentUser || currentUser.role !== "candidate") {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl pt-24">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                This page is only available for candidates.
              </p>
              <Button asChild variant="outline" className="border-border">
                <Link href="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground">
            Your bookmarked job opportunities
          </p>
        </div>

        <div className="flex gap-8">
          <SavedJobsSidebar savedJobsCount={savedJobs?.length || 0} />
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <Card className="border-border">
                <CardContent className="p-6">
                  <p className="text-destructive mb-4">
                    Failed to load saved jobs. Please try again.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-border"
                  >
                    Reload
                  </Button>
                </CardContent>
              </Card>
            ) : !savedJobs || savedJobs.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="p-12 text-center">
                  <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No saved jobs yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring opportunities and save jobs that interest
                    you.
                  </p>
                  <Button
                    asChild
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Link href="/jobs/search">
                      <Search className="w-4 h-4 mr-2" />
                      Search Jobs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedJobs.map((savedJob) => {
                  if (!savedJob.job) return null;
                  return (
                    <div key={savedJob.id} className="relative">
                      <JobCard job={savedJob.job} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsave(savedJob.job!.id)}
                        disabled={unsaveMutation.isPending}
                        className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
