import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/lib/api";
import type { Application } from "@/types";
import { toast } from "sonner";

/**
 * Fetches and caches the list of all applications.
 *
 * The result is cached and considered fresh for 2 minutes.
 *
 * @returns The query result for the applications list, containing the applications data and React Query metadata (status, error, etc.).
 */
export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => applicationsApi.getAll(),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetches applications for a specific job.
 *
 * The query is disabled when `jobId` is falsy and uses a 2-minute stale time.
 *
 * @param jobId - The numeric identifier of the job to fetch applications for.
 * @returns The React Query result containing the applications for the specified job.
 */
export function useJobApplications(jobId: number) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => applicationsApi.getByJobId(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Provide a mutation to update an application's status and refresh cached applications.
 *
 * Performs an API update for an application's status. On success, invalidates the ["applications"] query to refresh data and displays a success toast; on error, displays an error toast.
 *
 * @returns A React Query mutation object for performing the application status update.
 */
export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: Application["status"];
    }) => applicationsApi.update(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application status updated!");
    },
    onError: () => {
      toast.error("Failed to update application. Please try again.");
    },
  });
}