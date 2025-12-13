import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadCandidateCV,
  getEmployerProfile,
  updateEmployerProfile,
} from "./api";
import {
  UpdateCandidateProfileRequest,
  UpdateEmployerProfileRequest,
} from "@/types/profile";

// Candidate hooks
export function useCandidateProfile(id: string) {
  return useQuery({
    queryKey: ["candidate-profile", id],
    queryFn: () => getCandidateProfile(id),
    enabled: !!id,
  });
}

export function useUpdateCandidateProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCandidateProfileRequest) =>
      updateCandidateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-profile", id] });
    },
  });
}

export function useUploadCandidateCV(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCandidateCV(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-profile", id] });
    },
  });
}

// Employer hooks
export function useEmployerProfile(id: string) {
  return useQuery({
    queryKey: ["employer-profile", id],
    queryFn: () => getEmployerProfile(id),
    enabled: !!id,
  });
}

export function useUpdateEmployerProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployerProfileRequest) =>
      updateEmployerProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-profile", id] });
    },
  });
}
