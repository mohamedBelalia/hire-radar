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
  const { data } = await apiClient.get<CandidateProfile>(
    `/api/candidates/${id}`,
  );
  return data;
}

export async function updateCandidateProfile(
  id: string,
  profileData: UpdateCandidateProfileRequest,
): Promise<CandidateProfile> {
  const { data } = await apiClient.put<CandidateProfile>(
    `/api/candidates/${id}`,
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
    `/api/candidates/${id}/upload-cv`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
}

export async function uploadCandidateImage(
  id: string,
  file: File,
): Promise<{ image: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await apiClient.post<{ image: string }>(
    `/api/candidates/${id}/upload-image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

// Employer API functions
export async function getEmployerProfile(id: string): Promise<EmployerProfile> {
  const { data } = await apiClient.get<EmployerProfile>(`/api/employers/${id}`);
  return data;
}

export async function updateEmployerProfile(
  id: string,
  profileData: UpdateEmployerProfileRequest,
): Promise<EmployerProfile> {
  const { data } = await apiClient.put<EmployerProfile>(
    `/api/employers/${id}`,
    profileData,
  );
  return data;
}

export async function uploadEmployerImage(
  id: string,
  file: File,
): Promise<{ image: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await apiClient.post<{ image: string }>(
    `/api/employers/${id}/upload-image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}
