import apiClient from "@/lib/apiClient";

export interface Skill {
  id: number;
  name: string;
}

export interface EmployerJob {
  id: number;
  title: string;
  description: string;
  company: string;
  employer_id: number;
  location: string;
  salary_range?: string;
  emp_type?: string;
  responsibilities?: string[];
  skills: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

export interface EmployerJobsResponse {
  jobs: EmployerJob[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface GetEmployerJobsParams {
  page?: number;
  limit?: number;
  sort?: "created_at" | "title";
  order?: "asc" | "desc";
}

/**
 * Fetch all available skills
 */
export const getAvailableSkills = async (): Promise<Skill[]> => {
  try {
    const { data } = await apiClient.get<{ skills: Skill[] }>(
      "/api/jobs/skills",
    );
    return data.skills || [];
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return [];
  }
};

/**
 * Create a new skill or get existing one by name
 */
export const createOrGetSkill = async (skillName: string): Promise<Skill> => {
  const { data } = await apiClient.post<Skill>(
    "/api/jobs/skills",
    { name: skillName },
  );
  return data;
};

/**
 * Fetch all jobs created by the authenticated employer
 */
export const getEmployerJobs = async (
  params?: GetEmployerJobsParams,
): Promise<EmployerJobsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sort) queryParams.append("sort", params.sort);
  if (params?.order) queryParams.append("order", params.order);

  const { data } = await apiClient.get<EmployerJobsResponse>(
    `/api/jobs/my-jobs?${queryParams.toString()}`,
  );

  return data;
};

/**
 * Create a new job
 */
export const createJob = async (
  jobData: {
    title: string;
    description: string;
    company?: string;
    location: string;
    salary_range?: string;
    emp_type?: string;
    responsibilities?: string[];
    skill_ids?: number[];
    skill_names?: string[];
  },
): Promise<EmployerJob> => {
  const { data } = await apiClient.post<EmployerJob>("/api/jobs", jobData);
  return data;
};

/**
 * Update a job with skill_ids support
 */
export const updateJobWithSkills = async (
  jobId: number,
  jobData: {
    title?: string;
    description?: string;
    company?: string;
    location?: string;
    salary_range?: string;
    emp_type?: string;
    responsibilities?: string[];
    skill_ids?: number[];
  },
): Promise<EmployerJob> => {
  const { data } = await apiClient.put<EmployerJob>(
    `/api/jobs/${jobId}`,
    jobData,
  );
  return data;
};

/**
 * Update a job by ID (backward compatible)
 */
export const updateJob = async (
  jobId: number,
  jobData: Partial<EmployerJob>,
): Promise<EmployerJob> => {
  const { data } = await apiClient.put<EmployerJob>(
    `/api/jobs/${jobId}`,
    jobData,
  );
  return data;
};

/**
 * Delete a job by ID
 */
export const deleteJob = async (jobId: number): Promise<void> => {
  await apiClient.delete(`/api/jobs/${jobId}`);
};
