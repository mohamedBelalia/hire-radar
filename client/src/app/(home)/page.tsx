'use client'

import { useState, useEffect, useCallback } from "react";
import LeftSidebar from "@/app/(home)/components/LeftSidebar";
import RightSidebar from "@/app/(home)/components/RightSidebar";
import PostCreator from "@/app/(home)/components/PostCreator";
import { JobCard } from "./components/job-card";
import apiClient from "@/lib/apiClient";
import { Job } from "@/types";
import { getToken } from "@/lib";
import { useApplyJob, useReportJob } from "@/features/jobs/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const applyMutation = useApplyJob();
  const reportMutation = useReportJob();
  const router = useRouter();

  // Replace this with your auth token
  const token = getToken()

  const fetchJobs = useCallback(async (pageNum: number) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await apiClient.get(`/api/jobs/suggested?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newJobs: Job[] = (res.data.jobs || []).map((j: any) => ({
        ...j,
        id: Number(j.id),
        employer_id: Number(j.employer_id),
      }));

      // Check if there are more jobs
      if (newJobs.length < 10) setHasMore(false);

      setJobs((prev) => [...prev, ...newJobs]);

      // Separate posted jobs by current user
      const userPosted = newJobs.filter((job) => job.employer_id === res.data.currentUserId);
      setPostedJobs((prev) => [...prev, ...userPosted]);

    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch
  useEffect(() => {
    fetchJobs(page);
  }, [fetchJobs, page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      if (scrollBottom) setPage((prev) => prev + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex relative">
        <LeftSidebar />

        <main className="flex-1 min-w-0 px-8 py-4">
          <div className="space-y-6 max-w-5xl">
            <PostCreator />
            {/* Suggested Jobs */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold mb-3">Suggested Jobs</h2>
              {jobs.map((job) => (
                <JobCard
          key={job.id}
                  jobData={job}
                  onOpenDelete={() => {}}
                  onOpenUpdate={() => {}}
          onApply={async (jobId) => {
            try {
              await applyMutation.mutateAsync({ jobId });
              toast.success("Applied successfully");
            } catch (err) {
              const msg =
                (err as any)?.response?.data?.error ||
                (err as any)?.message ||
                "Failed to apply";
              toast.error(msg);
              console.error(err);
            }
          }}
          onReport={async (jobId) => {
            try {
              await reportMutation.mutateAsync({
                jobId,
                reason: "Inappropriate content",
              });
              toast.success("Report submitted");
            } catch (err) {
              const msg =
                (err as any)?.response?.data?.error ||
                (err as any)?.message ||
                "Failed to report";
              toast.error(msg);
              console.error(err);
            }
          }}
          onViewDetails={(jobId) => router.push(`/jobs/${jobId}`)}
                />
              ))}
            </div>

            {loading && <p className="text-center text-muted-foreground">Loading more jobs...</p>}
            {!hasMore && <p className="text-center text-muted-foreground">No more jobs.</p>}
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
