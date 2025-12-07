"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import JobFilters from "@/components/jobs/JobFilters";
import EmptyState from "@/components/jobs/EmptyState";
import ApplyModal from "@/components/jobs/ApplyModal";
import TopNavbar from "@/components/TopNavbar";
import { useInfiniteJobs } from "@/features/jobs/hooks";
import { Job } from "@/types/job";
import { toast } from "sonner";

export default function SearchJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [skill, setSkill] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteJobs({
    search: searchQuery,
    location: location,
    salary_min: salaryMin ? parseInt(salaryMin) : undefined,
    skill: skill,
    limit: 10,
  });

  const jobs = data?.pages.flatMap((page) => page.jobs) || [];
  const totalJobs = data?.pages[0]?.total || 0;

  const handleClearFilters = () => {
    setLocation("");
    setSalaryMin("");
    setSkill("");
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    try {
      // TODO: Implement actual API call to submit application
      // await submitApplication(jobId, { coverLetter, cvFile });
      toast.success("Application submitted successfully!");
      setIsApplyModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      throw error;
    }
  };

  const hasActiveFilters = !!(location || salaryMin || skill);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900">
      <TopNavbar />
      <div className="pt-16 max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover opportunities that match your skills and interests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search jobs by title, keywords, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalJobs > 0 ? (
                    <>
                      Found{" "}
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
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
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <p className="text-red-600 dark:text-red-400">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load jobs. Please try again."}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4"
                >
                  Reload Page
                </Button>
              </div>
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
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Loading...
                        </>
                      ) : (
                        "Load More Jobs"
                      )}
                    </Button>
                  </div>
                )}

                {/* End of Results */}
                {!hasNextPage && jobs.length > 0 && (
                  <div className="mt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      You&apos;ve reached the end of the results
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Apply Modal */}
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onApply={handleSubmitApplication}
        />
      </div>
    </div>
  );
}
