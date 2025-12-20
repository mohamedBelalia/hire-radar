import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "@/lib/api";
import type { Candidate } from "@/types";
import { toast } from "sonner";

// Get all candidates
export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: () => candidatesApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get single candidate
// Note: Endpoint doesn't exist in backend - returns null
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

// Update candidate mutation
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

// Upload CV mutation
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

// Add skill mutation
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

// Remove skill mutation
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

// Get random candidates
export function useRandomCandidates() {
  return useQuery({
    queryKey: ["random-candidates"],
    queryFn: () => candidatesApi.getRandom(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
