"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import JobFilters from "@/components/jobs/JobFilters";
import EmptyState from "@/components/jobs/EmptyState";
import TopNavbar from "@/components/TopNavbar";
import { useInfiniteJobs, useApplyJob } from "@/features/jobs/hooks";
import { Job } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * Render the job search and results page with filters, infinite scrolling, and an application workflow.
 *
 * The page synchronizes filter state with the URL, fetches paginated job results, shows loading/error/empty states,
 * and provides a modal to submit job applications with an optional cover letter.
 *
 * @returns The React element for the jobs search page UI.
 */
export default function SearchJobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [salaryMin, setSalaryMin] = useState(
    searchParams.get("salary_min") || "",
  );
  const [skill, setSkill] = useState(searchParams.get("skill") || "");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const applyMutation = useApplyJob();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteJobs({
    search: searchQuery || undefined,
    location: location || undefined,
    salary_min: salaryMin ? parseInt(salaryMin) : undefined,
    skill: skill || undefined,
    limit: 10,
  });

  const jobs = data?.pages.flatMap((page) => page.jobs) || [];
  const totalJobs = data?.pages[0]?.total || 0;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (location) params.set("location", location);
    if (salaryMin) params.set("salary_min", salaryMin);
    if (skill) params.set("skill", skill);
    router.replace(`/jobs/search?${params.toString()}`, { scroll: false });
  }, [searchQuery, location, salaryMin, skill, router]);

  const handleClearFilters = () => {
    setLocation("");
    setSalaryMin("");
    setSkill("");
    setSearchQuery("");
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    try {
      await applyMutation.mutateAsync({
        jobId: selectedJob.id,
        coverLetter: coverLetter || undefined,
      });
      setIsApplyModalOpen(false);
      setSelectedJob(null);
      setCoverLetter("");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const hasActiveFilters = !!(location || salaryMin || skill);

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and interests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs by title, keywords, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-background border-border"
            />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <JobFilters
              location={location}
              salaryMin={salaryMin}
              skill={skill}
              onLocationChange={setLocation}
              onSalaryMinChange={setSalaryMin}
              onSkillChange={setSkill}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Job List */}
          <main className="flex-1">
            {/* Results Count */}
            {!isLoading && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalJobs > 0 ? (
                    <>
                      Found{" "}
                      <span className="font-semibold text-foreground">
                        {totalJobs}
                      </span>{" "}
                      job{totalJobs !== 1 ? "s" : ""}
                    </>
                  ) : (
                    "No jobs found"
                  )}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <p className="text-destructive mb-4">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load jobs. Please try again."}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-border"
                  >
                    Reload Page
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !isError && jobs.length === 0 && (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
              />
            )}

            {/* Job Cards */}
            {!isLoading && !isError && jobs.length > 0 && (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} onApply={handleApply} />
                  ))}
                </div>

                {/* Infinite Scroll Load More */}
                {hasNextPage && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                      className="border-border"
                    >
                      {isFetchingNextPage ? "Loading..." : "Load More Jobs"}
                    </Button>
                  </div>
                )}

                {/* End of Results */}
                {!hasNextPage && jobs.length > 0 && (
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground">
                      You&apos;ve reached the end of the results
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Apply Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="border-border">
            <DialogHeader>
              <DialogTitle>Apply to {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                {selectedJob?.company_name || selectedJob?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell the employer why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[120px] bg-background border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setCoverLetter("");
                }}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={applyMutation.isPending}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {applyMutation.isPending
                  ? "Submitting..."
                  : "Submit Application"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}