import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employersApi } from "@/lib/api";
import type { Employer } from "@/types";
import { toast } from "sonner";

/**
 * Fetches and caches the list of employers.
 *
 * @returns The query result containing the fetched employers array (may be `undefined` while loading) and React Query state for the request.
 */
export function useEmployers() {
  return useQuery({
    queryKey: ["employers"],
    queryFn: () => employersApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get single employer
/**
 * Fetches a single employer by its id.
 *
 * If the backend endpoint is unavailable or an error occurs, the query result is `null`. The query is disabled when `id` is falsy and caches results for five minutes.
 *
 * @param id - The employer's identifier; when falsy the query is not executed
 * @returns The employer object for the given `id`, or `null` if not found or an error occurs
 */
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

/**
 * Create a mutation hook to update an employer and refresh related employer query caches.
 *
 * On success, invalidates the cache for the updated employer and the list of employers and shows a success toast.
 * On error, shows an error toast.
 *
 * @returns The React Query mutation object for performing employer updates and observing mutation state.
 */
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