import apiClient from "@/lib/apiClient";
import { Job, JobSearchParams, JobSearchResponse, SaveJobResponse } from "@/types/job";

export async function searchJobs(params: JobSearchParams = {}): Promise<JobSearchResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.location) queryParams.append('location', params.location);
  if (params.salary_min) queryParams.append('salary_min', params.salary_min.toString());
  if (params.skill) queryParams.append('skill', params.skill);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const { data } = await apiClient.get<JobSearchResponse>(
    `/jobs?${queryParams.toString()}`
  );
  return data;
}

export async function getJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`);
  return data;
}

export async function saveJob(jobId: string): Promise<SaveJobResponse> {
  const { data } = await apiClient.post<SaveJobResponse>(`/jobs/${jobId}/save`);
  return data;
}

export async function unsaveJob(jobId: string): Promise<SaveJobResponse> {
  const { data } = await apiClient.delete<SaveJobResponse>(`/jobs/${jobId}/save`);
  return data;
}

export async function getSavedJobs(candidateId: string): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>(`/candidates/${candidateId}/saved-jobs`);
  return data;
}

export async function applyToJob(jobId: string, applicationData?: { cover_letter?: string; cv_file?: File }): Promise<{ message: string; application_id: string }> {
  const formData = new FormData();
  if (applicationData?.cover_letter) {
    formData.append('cover_letter', applicationData.cover_letter);
  }
  if (applicationData?.cv_file) {
    formData.append('cv_file', applicationData.cv_file);
  }

  const { data } = await apiClient.post<{ message: string; application_id: string }>(
    `/jobs/${jobId}/apply`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
}
