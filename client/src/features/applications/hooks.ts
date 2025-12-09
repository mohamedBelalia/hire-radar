import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/lib/api";
import type { Application } from "@/types";
import { toast } from "sonner";

// Get all applications
export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => applicationsApi.getAll(),
    staleTime: 1000 * 60 * 2,
  });
}

// Get applications for a job
export function useJobApplications(jobId: number) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => applicationsApi.getByJobId(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2,
  });
}

// Update application status mutation
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
