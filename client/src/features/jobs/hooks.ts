import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { searchJobs, saveJob, unsaveJob, getJobById, getSavedJobs, applyToJob } from "./api";
import { JobSearchParams } from "@/types/job";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// Search jobs hook with debouncing
export function useSearchJobs(params: JobSearchParams) {
  const debouncedSearch = useDebounce(params.search || '', 500);
  const debouncedLocation = useDebounce(params.location || '', 500);

  const queryParams = useMemo(
    () => ({
      ...params,
      search: debouncedSearch || undefined,
      location: debouncedLocation || undefined,
    }),
    [debouncedSearch, debouncedLocation, params.salary_min, params.skill, params.page, params.limit]
  );

  return useQuery({
    queryKey: ["jobs", "search", queryParams],
    queryFn: () => searchJobs(queryParams),
    enabled: true,
    staleTime: 30000, // 30 seconds
  });
}

// Infinite scroll version
export function useInfiniteJobs(params: Omit<JobSearchParams, 'page'>) {
  const debouncedSearch = useDebounce(params.search || '', 500);
  const debouncedLocation = useDebounce(params.location || '', 500);

  const queryParams = useMemo(
    () => ({
      ...params,
      search: debouncedSearch || undefined,
      location: debouncedLocation || undefined,
    }),
    [debouncedSearch, debouncedLocation, params.salary_min, params.skill, params.limit]
  );

  return useInfiniteQuery({
    queryKey: ["jobs", "infinite", queryParams],
    queryFn: ({ pageParam = 1 }) =>
      searchJobs({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 30000,
  });
}

// Get single job
export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}

// Save job mutation
export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => saveJob(jobId),
    onSuccess: (data, jobId) => {
      // Invalidate all job queries to update saved status
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
  });
}

// Unsave job mutation
export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => unsaveJob(jobId),
    onSuccess: (data, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });
}

// Get saved jobs for a candidate
export function useSavedJobs(candidateId: string) {
  return useQuery({
    queryKey: ["saved-jobs", candidateId],
    queryFn: () => getSavedJobs(candidateId),
    enabled: !!candidateId,
    staleTime: 30000,
  });
}

// Apply to job mutation
export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, applicationData }: { jobId: string; applicationData?: { cover_letter?: string; cv_file?: File } }) =>
      applyToJob(jobId, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
