import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employersApi } from "@/lib/api";
import type { Employer } from "@/types";
import { toast } from "sonner";

// Get all employers
export function useEmployers() {
  return useQuery({
    queryKey: ["employers"],
    queryFn: () => employersApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get single employer
// Note: Endpoint doesn't exist in backend - returns null
export function useEmployer(id: number) {
  return useQuery({
    queryKey: ["employer", id],
    queryFn: async () => {
      try {
        return await employersApi.getById(id);
      } catch (error) {
        // Endpoint doesn't exist, return null
        return null;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// Update employer mutation
export function useUpdateEmployer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employer> }) =>
      employersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employer", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["employers"] });
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });
}

// Get random employers
export function useRandomEmployers() {
  return useQuery({
    queryKey: ["random-employers"],
    queryFn: () => employersApi.getRandom(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
