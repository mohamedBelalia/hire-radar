import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateProfile,
  uploadCandidateCV,
  getEmployerProfile,
  updateEmployerProfile,
  uploadCandidateImage,
  uploadEmployerImage,
  getPublicProfile,
} from "./api";
import { UpdateEmployerProfileRequest } from "@/types/profile";

// Candidate hooks
export function useCandidateProfile(id: string) {
  return useQuery({
    queryKey: ["candidate-profile", id],
    queryFn: () => getCandidateProfile(id),
    enabled: !!id,
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

export function useUploadCandidateImage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCandidateImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-profile", id] });
      // Refetch currentUser immediately to get updated image
      queryClient.refetchQueries({ queryKey: ["currentUser"] });
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

export function useUploadEmployerImage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadEmployerImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-profile", id] });
      // Refetch currentUser immediately to get updated image
      queryClient.refetchQueries({ queryKey: ["currentUser"] });
    },
  });
}
export function usePublicProfile(id: string) {
  return useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => getPublicProfile(id),
    enabled: !!id,
  });
}
