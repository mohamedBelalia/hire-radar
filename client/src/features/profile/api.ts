import apiClient from "@/lib/apiClient";
import {
  CandidateProfile,
  EmployerProfile,
  UpdateCandidateProfileRequest,
  UpdateEmployerProfileRequest,
  UploadCVResponse,
} from "@/types/profile";

/**
 * Fetches a candidate's profile by ID.
 *
 * @param id - The candidate's unique identifier
 * @returns The candidate's profile
 */
export async function getCandidateProfile(
  id: string,
): Promise<CandidateProfile> {
  const { data } = await apiClient.get<CandidateProfile>(`/candidates/${id}`);
  return data;
}

/**
 * Update a candidate's profile.
 *
 * @param id - The candidate's unique identifier
 * @param profileData - Fields to apply to the candidate's profile update
 * @returns The updated candidate profile
 */
export async function updateCandidateProfile(
  id: string,
  profileData: UpdateCandidateProfileRequest,
): Promise<CandidateProfile> {
  const { data } = await apiClient.put<CandidateProfile>(
    `/candidates/${id}`,
    profileData,
  );
  return data;
}

/**
 * Uploads a candidate's CV file to the server for the candidate identified by `id`.
 *
 * @param id - Candidate identifier used in the upload endpoint
 * @param file - CV file to upload; sent as multipart/form-data under the `cv` field
 * @returns The server's upload response as an `UploadCVResponse`
 */
export async function uploadCandidateCV(
  id: string,
  file: File,
): Promise<UploadCVResponse> {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await apiClient.post<UploadCVResponse>(
    `/candidates/${id}/upload-cv`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
}

/**
 * Fetches an employer's profile by ID.
 *
 * @param id - The employer's unique identifier
 * @returns The employer profile
 */
export async function getEmployerProfile(id: string): Promise<EmployerProfile> {
  const { data } = await apiClient.get<EmployerProfile>(`/employers/${id}`);
  return data;
}

/**
 * Update an employer's profile with the provided fields.
 *
 * @param id - The employer's unique identifier
 * @param profileData - Fields to update on the employer profile
 * @returns The updated EmployerProfile
 */
export async function updateEmployerProfile(
  id: string,
  profileData: UpdateEmployerProfileRequest,
): Promise<EmployerProfile> {
  const { data } = await apiClient.put<EmployerProfile>(
    `/employers/${id}`,
    profileData,
  );
  return data;
}