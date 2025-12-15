import apiClient from "@/lib/apiClient";
import {
  Job,
  JobSearchParams,
  JobSearchResponse,
  SaveJobResponse,
} from "@/types/job";

/**
 * Search for jobs using optional filters and pagination.
 *
 * @param params - Optional filters: `search` (query string), `location`, `salary_min`, `skill`, `page`, and `limit`.
 * @returns A JobSearchResponse containing matching jobs and pagination metadata.
 */
export async function searchJobs(
  params: JobSearchParams = {},
): Promise<JobSearchResponse> {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.location) queryParams.append("location", params.location);
  if (params.salary_min)
    queryParams.append("salary_min", params.salary_min.toString());
  if (params.skill) queryParams.append("skill", params.skill);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  const { data } = await apiClient.get<JobSearchResponse>(
    `/jobs?${queryParams.toString()}`,
  );
  return data;
}

/**
 * Retrieve a job by its identifier.
 *
 * @param id - The job's unique identifier
 * @returns The job object corresponding to the given `id`
 */
export async function getJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`);
  return data;
}

/**
 * Save the specified job for the current user.
 *
 * @param jobId - The identifier of the job to save
 * @returns The API response confirming the job was saved
 */
export async function saveJob(jobId: string): Promise<SaveJobResponse> {
  const { data } = await apiClient.post<SaveJobResponse>(`/jobs/${jobId}/save`);
  return data;
}

/**
 * Remove a saved job for the current user.
 *
 * @param jobId - The identifier of the job to unsave
 * @returns `SaveJobResponse` containing confirmation of the unsave operation
 */
export async function unsaveJob(jobId: string): Promise<SaveJobResponse> {
  const { data } = await apiClient.delete<SaveJobResponse>(
    `/jobs/${jobId}/save`,
  );
  return data;
}

/**
 * Fetches saved jobs for a candidate.
 *
 * @param candidateId - The candidate's unique identifier
 * @returns An array of `Job` objects representing jobs the candidate has saved
 */
export async function getSavedJobs(candidateId: string): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>(
    `/candidates/${candidateId}/saved-jobs`,
  );
  return data;
}

/**
 * Submit an application for a job, optionally including a cover letter and CV file.
 *
 * @param jobId - The identifier of the job to apply to
 * @param applicationData - Optional application fields: `cover_letter` text and `cv_file` (File) to upload
 * @returns An object containing `message` and the created `application_id`
 */
export async function applyToJob(
  jobId: string,
  applicationData?: { cover_letter?: string; cv_file?: File },
): Promise<{ message: string; application_id: string }> {
  const formData = new FormData();
  if (applicationData?.cover_letter) {
    formData.append("cover_letter", applicationData.cover_letter);
  }
  if (applicationData?.cv_file) {
    formData.append("cv_file", applicationData.cv_file);
  }

  const { data } = await apiClient.post<{
    message: string;
    application_id: string;
  }>(`/jobs/${jobId}/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}