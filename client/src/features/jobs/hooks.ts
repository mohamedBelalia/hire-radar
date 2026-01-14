import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobsApi, candidatesApi, aiApi, applicationsApi } from "@/lib/api";
import type { Job, JobFilters, SavedJob } from "@/types";
import { toast } from "sonner";

/**
 * Fetches the list of jobs matching the provided filters.
 *
 * @param filters - Optional criteria to filter or paginate the jobs (e.g., search, location, limit, offset)
 * @returns The query result containing the fetched jobs list and React Query metadata (status, isLoading, error, etc.)
 */
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => jobsApi.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Provides an infinite-scrolling query for jobs using optional filters.
 *
 * @param filters - Optional job filters applied to each request; `limit` (if provided) determines page size, while `offset` is managed automatically for pagination.
 * @returns A React Query infinite-query result for paginated job data, including loaded pages, metadata, and helpers to fetch more pages or manage cache.
 */
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

/**
 * Fetches a single job by its ID and exposes the query state.
 *
 * The query is enabled only when `id` is truthy and treats data as fresh for five minutes.
 *
 * @returns The query result containing the job object in `data`, or `undefined` if not available.
 */
export function useJob(id: number) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetches recent jobs for the home page.
 *
 * @param limit - Maximum number of jobs to fetch (default 5)
 * @returns The query result containing the list of recent jobs
 */
export function useRecentJobs(limit: number = 5) {
  return useQuery({
    queryKey: ["jobs", "recent", limit],
    queryFn: () => jobsApi.getAll({ limit }),
    staleTime: 1000 * 60 * 2,
  });
}

// Save job mutation
/**
 * Provides a mutation hook to save a job by its ID.
 *
 * Calling the mutation with a job ID attempts to save that job; on success it invalidates the "jobs" and "saved-jobs" query caches and shows a success toast, and on failure it shows an error toast and rethrows the error.
 *
 * @returns A React Query mutation result for saving a job; invoke the mutation with a job ID to perform the save.
 */
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
/**
 * Provides a React Query mutation hook to unsave a job.
 *
 * Performs an unsave operation for a given job ID; on success it invalidates the `jobs` and `saved-jobs` query caches and shows a success toast, and on failure shows an error toast (backend endpoint may be unavailable).
 *
 * @returns A mutation object whose mutate/mutateAsync method accepts a `number` job ID and triggers the unsave operation
 */
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

// Apply to job mutation
/**
 * Apply to a job with an optional cover letter.
 *
 * Invalidates job and application caches on success and shows success or error toasts.
 *
 * @returns The React Query mutation object to perform the application; call `mutate` or `mutateAsync` with `{ jobId, coverLetter? }`.
 */
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
      try {
        return await jobsApi.apply(jobId, { cover_letter: coverLetter });
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? (error.message as string)
            : "Application feature not available yet";
        toast.error(message);
        throw error;
      }
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

// Get saved jobs for a candidate
/**
 * Fetches saved jobs for a candidate, falling back to an empty array if the backend endpoint is unavailable.
 *
 * @param candidateId - Candidate identifier; when falsy the query is disabled.
 * @returns An array of saved job objects; returns an empty array if the endpoint is unavailable or an error occurs.
 */
export function useSavedJobs(candidateId: number) {
  return useQuery({
    queryKey: ["saved-jobs", candidateId],
    queryFn: async () => {
      try {
        return await candidatesApi.getSavedJobs(candidateId);
      } catch (error) {
        // Endpoint doesn't exist, return empty array
        return [];
      }
    },
    enabled: !!candidateId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetches applications for the given candidate.
 *
 * @param candidateId - ID of the candidate whose applications to fetch; when falsy the query is disabled
 * @returns The React Query result containing the candidate's applications array
 */
export function useCandidateApplications(candidateId: number) {
  return useQuery({
    queryKey: ["applications", "candidate", candidateId],
    queryFn: () => candidatesApi.getApplications(candidateId),
    enabled: !!candidateId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetches job recommendations for a candidate.
 *
 * @param candidateId - The candidate's numeric identifier; the query is disabled when this value is falsy.
 * @returns The query result containing recommended jobs data along with React Query status and metadata.
 */
export function useRecommendedJobs(candidateId: number) {
  return useQuery({
    queryKey: ["recommended-jobs", candidateId],
    queryFn: () => aiApi.recommendJobs(candidateId),
    enabled: !!candidateId,
    staleTime: 1000 * 60 * 5,
  });
}

// Get recommended candidates for a job
/**
 * Fetches AI-recommended candidates for a job.
 *
 * @param jobId - The job's ID to request recommendations for; when falsy the query is disabled.
 * @returns The query's data: an array of recommended candidate objects (may be empty; backend endpoint may return an empty array).
 */
export function useRecommendedCandidates(jobId: number) {
  return useQuery({
    queryKey: ["recommended-candidates", jobId],
    queryFn: () => aiApi.recommendCandidates(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
  });
}