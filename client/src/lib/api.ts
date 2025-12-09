/**
 * Centralized API service
 * Handles all API calls with proper error handling and 401 redirects
 */

import apiClient from "./apiClient";
import type {
  Job,
  JobsResponse,
  JobFilters,
  Candidate,
  Employer,
  Application,
  SavedJob,
  RecommendedJob,
  RecommendedCandidate,
  User,
} from "@/types";

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<{ token: string; user: User }>(
      "/api/auth/login",
      { email, password }
    );
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/api/auth/me");
    return data;
  },
};

// Jobs API
export const jobsApi = {
  getAll: async (filters?: JobFilters): Promise<JobsResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.salary_min)
      params.append("salary_min", filters.salary_min.toString());
    if (filters?.skill) params.append("skill", filters.skill);
    // Backend uses page/limit, not offset
    const page = filters?.offset ? Math.floor(filters.offset / (filters.limit || 10)) + 1 : 1;
    const limit = filters?.limit || 10;
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const { data } = await apiClient.get<{
      jobs: any[];
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    }>(`/api/jobs?${params.toString()}`);
    
    // Backend returns string IDs, convert to numbers
    const jobs = data.jobs.map((job) => ({
      ...job,
      id: parseInt(job.id),
      employer_id: parseInt(job.employer_id),
    }));
    
    return {
      jobs,
      total: data.total,
      limit: data.limit,
      offset: (data.page - 1) * data.limit,
    };
  },

  getById: async (id: number): Promise<Job> => {
    const { data } = await apiClient.get<any>(`/api/jobs/${id}`);
    // Backend returns string IDs, convert to numbers
    return {
      ...data,
      id: parseInt(data.id),
      employer_id: parseInt(data.employer_id),
    };
  },

  create: async (jobData: Partial<Job>): Promise<Job> => {
    const { data } = await apiClient.post<Job>("/api/jobs", jobData);
    return data;
  },

  update: async (id: number, jobData: Partial<Job>): Promise<Job> => {
    const { data } = await apiClient.put<Job>(`/api/jobs/${id}`, jobData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/jobs/${id}`);
  },

  // Note: These endpoints don't exist in the backend yet
  // Stubbing them out for now - they will return errors
  apply: async (jobId: number, applicationData?: { cover_letter?: string }) => {
    throw new Error("Job application endpoint not implemented in backend");
  },

  save: async (jobId: number): Promise<void> => {
    throw new Error("Save job endpoint not implemented in backend");
  },

  unsave: async (jobId: number): Promise<void> => {
    throw new Error("Unsave job endpoint not implemented in backend");
  },
};

// Candidates API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const candidatesApi = {
  getAll: async (): Promise<Candidate[]> => {
    throw new Error("Candidates endpoint not implemented in backend");
  },

  getById: async (id: number): Promise<Candidate> => {
    throw new Error("Candidate endpoint not implemented in backend");
  },

  update: async (id: number, candidateData: Partial<Candidate>): Promise<Candidate> => {
    throw new Error("Update candidate endpoint not implemented in backend");
  },

  uploadCV: async (id: number, file: File): Promise<{ cv_file_path: string }> => {
    throw new Error("CV upload endpoint not implemented in backend");
  },

  getSavedJobs: async (id: number): Promise<SavedJob[]> => {
    throw new Error("Saved jobs endpoint not implemented in backend");
  },

  getApplications: async (id: number): Promise<Application[]> => {
    throw new Error("Applications endpoint not implemented in backend");
  },

  addSkill: async (id: number, skillId: number): Promise<void> => {
    throw new Error("Add skill endpoint not implemented in backend");
  },

  removeSkill: async (id: number, skillId: number): Promise<void> => {
    throw new Error("Remove skill endpoint not implemented in backend");
  },
};

// Employers API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const employersApi = {
  getAll: async (): Promise<Employer[]> => {
    throw new Error("Employers endpoint not implemented in backend");
  },

  getById: async (id: number): Promise<Employer> => {
    throw new Error("Employer endpoint not implemented in backend");
  },

  update: async (id: number, employerData: Partial<Employer>): Promise<Employer> => {
    throw new Error("Update employer endpoint not implemented in backend");
  },
};

// Applications API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const applicationsApi = {
  getAll: async (): Promise<Application[]> => {
    throw new Error("Applications endpoint not implemented in backend");
  },

  getByJobId: async (jobId: number): Promise<Application[]> => {
    throw new Error("Job applications endpoint not implemented in backend");
  },

  update: async (id: number, status: Application["status"]): Promise<Application> => {
    throw new Error("Update application endpoint not implemented in backend");
  },
};

// AI Recommendations API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const aiApi = {
  recommendJobs: async (candidateId: number): Promise<RecommendedJob[]> => {
    // Return empty array for now since endpoint doesn't exist
    return [];
  },

  recommendCandidates: async (jobId: number): Promise<RecommendedCandidate[]> => {
    // Return empty array for now since endpoint doesn't exist
    return [];
  },
};
