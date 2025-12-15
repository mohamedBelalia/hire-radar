import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "@/lib/api";
import type { Candidate } from "@/types";
import { toast } from "sonner";

/**
 * Fetches and caches the list of all candidates.
 *
 * The response is cached for 5 minutes to reduce network requests.
 *
 * @returns The query result containing an array of candidates along with query state and metadata.
 */
export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: () => candidatesApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get single candidate
/**
 * Get the React Query result for a candidate by id.
 *
 * @param id - Candidate identifier; the query is disabled when `id` is falsy.
 * @returns The query result whose `data` is the `Candidate` for the given `id`, or `null` if the candidate is not available.
 */
export function useCandidate(id: number) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      try {
        return await candidatesApi.getById(id);
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
 * Create a mutation hook to update a candidate's profile.
 *
 * The mutation accepts an object with `id` and partial candidate `data`. On success it invalidates
 * the cached ["candidate", id] and ["candidates"] queries and shows a success toast; on error it
 * shows an error toast.
 *
 * @returns A React Query mutation object that expects `{ id: number; data: Partial<Candidate> }` as variables and performs the update operation
 */
export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Candidate> }) =>
      candidatesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });
}

/**
 * Provides a React Query mutation for uploading a candidate's CV and handling cache updates and user notifications.
 *
 * @returns A mutation object that accepts `{ id, file }`; on success it invalidates the `["candidate", id]` query and shows a success toast, and on error shows an error toast.
 */
export function useUploadCV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      candidatesApi.uploadCV(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", variables.id] });
      toast.success("CV uploaded successfully!");
    },
    onError: () => {
      toast.error("Failed to upload CV. Please try again.");
    },
  });
}

/**
 * Provides a React Query mutation that adds a skill to a candidate.
 *
 * @returns A mutation object that, when executed with `{ id, skillId }`, adds the skill to the candidate. On success it invalidates the `["candidate", id]` query and shows a success toast; on error it shows an error toast.
 */
export function useAddSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, skillId }: { id: number; skillId: number }) =>
      candidatesApi.addSkill(id, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", variables.id] });
      toast.success("Skill added successfully!");
    },
    onError: () => {
      toast.error("Failed to add skill. Please try again.");
    },
  });
}

/**
 * Creates a mutation hook to remove a skill from a candidate.
 *
 * @returns A React Query mutation object whose `mutate`/`mutateAsync` function accepts an object `{ id, skillId }`; on success it invalidates the `["candidate", id]` query and shows a success toast, and on error it shows an error toast.
 */
export function useRemoveSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, skillId }: { id: number; skillId: number }) =>
      candidatesApi.removeSkill(id, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", variables.id] });
      toast.success("Skill removed successfully!");
    },
    onError: () => {
      toast.error("Failed to remove skill. Please try again.");
    },
  });
}