import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobsApi, candidatesApi, aiApi } from "@/lib/api";
import type { JobFilters } from "@/types";
import { toast } from "sonner";

// Get all jobs with filters
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => jobsApi.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Infinite scroll for jobs
export function useInfiniteJobs(filters?: JobFilters) {
  return useInfiniteQuery({
    queryKey: ["jobs", "infinite", filters],
    queryFn: ({ pageParam = 0 }) =>
      jobsApi.getAll({
        ...filters,
        offset: pageParam,
        limit: filters?.limit || 10,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.jobs.length,
        0,
      );
      // Check if there are more pages to load
      if (totalLoaded < lastPage.total) {
        return totalLoaded;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
}

// Get single job
export function useJob(id: number) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// Get recent jobs (for home page)
export function useRecentJobs(limit: number = 5) {
  return useQuery({
    queryKey: ["jobs", "recent", limit],
    queryFn: () => jobsApi.getAll({ limit }),
    staleTime: 1000 * 60 * 2,
  });
}

// Save job mutation
// Note: Endpoint doesn't exist in backend - will show error toast
export function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: number) => {
      try {
        await jobsApi.save(jobId);
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? (error.message as string)
            : "Save job feature not available yet";
        toast.error(message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Job saved");
    },
  });
}

// Unsave job mutation
// Note: Endpoint doesn't exist in backend - will show error toast
export function useUnsaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: number) => {
      try {
        await jobsApi.unsave(jobId);
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? (error.message as string)
            : "Unsave job feature not available yet";
        toast.error(message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Job unsaved");
    },
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      coverLetter,
    }: {
      jobId: number;
      coverLetter?: string;
    }) => {
      const res = await jobsApi.apply(jobId, { cover_letter: coverLetter });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application submitted successfully!");
    },
    onError: () => {
      // Error already shown in mutationFn
    },
  });
}

// Report job mutation
export function useReportJob() {
  return useMutation({
    mutationFn: async ({ jobId, reason }: { jobId: number; reason: string }) => {
      return jobsApi.report(jobId, reason);
    },
    onSuccess: () => {
      toast.success("Report submitted. Thank you for the feedback.");
    },
    onError: () => {
      toast.error("Failed to submit report");
    },
  });
}

// Get saved jobs for a candidate
// Note: Endpoint doesn't exist in backend - returns empty array
export function useSavedJobs(candidateId: number) {
  return useQuery({
    queryKey: ["saved-jobs", candidateId],
    queryFn: async () => {
      try {
        return await candidatesApi.getSavedJobs(candidateId);
      } catch {
        // Endpoint doesn't exist, return empty array
        return [];
      }
    },
    enabled: !!candidateId,
    staleTime: 1000 * 60 * 2,
  });
}

// Get applications for a candidate
export function useCandidateApplications(candidateId: number) {
  return useQuery({
    queryKey: ["applications", "candidate", candidateId],
    queryFn: () => candidatesApi.getApplications(candidateId),
    enabled: !!candidateId,
    staleTime: 1000 * 60 * 2,
  });
}

// Get recommended jobs for a candidate
export function useRecommendedJobs(candidateId: number) {
  return useQuery({
    queryKey: ["recommended-jobs", candidateId],
    queryFn: () => aiApi.recommendJobs(candidateId),
    enabled: !!candidateId,
    staleTime: 1000 * 60 * 5,
  });
}

// Get recommended candidates for a job
// Note: Endpoint doesn't exist in backend - returns empty array
export function useRecommendedCandidates(jobId: number) {
  return useQuery({
    queryKey: ["recommended-candidates", jobId],
    queryFn: () => aiApi.recommendCandidates(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
  });
}
