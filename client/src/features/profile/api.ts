import apiClient from "@/lib/apiClient";
import {
  CandidateProfile,
  EmployerProfile,
  UpdateCandidateProfileRequest,
  UpdateEmployerProfileRequest,
  UploadCVResponse,
} from "@/types/profile";

// Candidate API functions
export async function getCandidateProfile(
  id: string,
): Promise<CandidateProfile> {
  const { data } = await apiClient.get<CandidateProfile>(`/candidates/${id}`);
  return data;
}

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

// Employer API functions
export async function getEmployerProfile(id: string): Promise<EmployerProfile> {
  const { data } = await apiClient.get<EmployerProfile>(`/employers/${id}`);
  return data;
}

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
