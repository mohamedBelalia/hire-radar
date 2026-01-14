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

/**
 * Provides a React Query for loading a candidate's profile by ID.
 *
 * @param id - Candidate identifier used to fetch the profile; when falsy the query is disabled
 * @returns The query result containing the candidate profile data and query status
 */
export function useCandidateProfile(id: string) {
  return useQuery({
    queryKey: ["candidate-profile", id],
    queryFn: () => getCandidateProfile(id),
    enabled: !!id,
  });
}

/**
 * Creates a mutation hook to update a candidate profile and refresh its cached profile data.
 *
 * @param id - Candidate identifier used for the update and for invalidating the corresponding query cache
 * @returns A React Query mutation object that accepts an `UpdateCandidateProfileRequest` and updates the candidate's profile; on success it invalidates the `["candidate-profile", id]` query
 */
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

/**
 * Provides a mutation hook for uploading a candidate's CV and refreshing that candidate's profile cache.
 *
 * @param id - Candidate identifier used for the upload request and for invalidating the corresponding profile query
 * @returns A React Query mutation object that accepts a `File`, uploads it as the candidate's CV, and invalidates the `["candidate-profile", id]` query on success
 */
export function useUploadCandidateCV(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCandidateCV(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-profile", id] });
    },
  });
}

/**
 * Provides a React Query hook that fetches an employer's profile.
 *
 * @param id - The employer's identifier used to fetch the profile; the query is disabled when this is empty
 * @returns The query result containing the employer profile data, loading/error status, and related query controls
 */
export function useEmployerProfile(id: string) {
  return useQuery({
    queryKey: ["employer-profile", id],
    queryFn: () => getEmployerProfile(id),
    enabled: !!id,
  });
}

/**
 * Creates a mutation for updating an employer's profile.
 *
 * @param id - The employer's identifier whose profile will be updated
 * @returns A React Query mutation object that updates the employer profile; on success it invalidates the `["employer-profile", id]` query to refresh cached data
 */
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