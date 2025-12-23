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
  ConnectionRequest,
  Notification,
  SuggestedPerson,
  Connection,
} from "@/types";

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<{ token: string; user: User }>(
      "/api/auth/login",
      { email, password },
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
    const page = filters?.offset
      ? Math.floor(filters.offset / (filters.limit || 10)) + 1
      : 1;
    const limit = filters?.limit || 10;
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const { data } = await apiClient.get<{
      jobs: Array<
        Omit<Job, "id" | "employer_id"> & { id: string; employer_id: string }
      >;
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
    const { data } = await apiClient.get<{
      id: string;
      employer_id: string;
      company?: string;
      company_name?: string;
      employer?: {
        id?: number | null;
        full_name?: string | null;
        email?: string | null;
        role?: string | null;
        headLine?: string | null;
        image?: string | null;
      } | null;
      skills?: Array<{ id?: number; name?: string } | string> | null;
      [key: string]: unknown;
    }>(`/api/jobs/${id}`);

    // Normalize skills to string array
    const normalizedSkills =
      (data.skills || [])?.map((s) =>
        typeof s === "string" ? s : (s?.name as string),
      ) || [];

    // Backend returns string IDs, convert to numbers
    return {
      ...data,
      id: parseInt(data.id),
      employer_id: parseInt(data.employer_id),
      company_name: data.company_name || (data as { company?: string }).company || "",
      skills: normalizedSkills,
      applicants_count: (data as { applicants_count?: number }).applicants_count,
    } as Job;
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
  apply: async (
    jobId: number,
    applicationData?: { cover_letter?: string },
  ) => {
    const { data } = await apiClient.post<{ application_id: number }>(
      `/api/jobs/${jobId}/apply`,
      applicationData || {},
    );
    return data;
  },

  save: async (jobId: number): Promise<void> => {
    await apiClient.post(`/api/jobs/${jobId}/save`);
  },

  unsave: async (jobId: number): Promise<void> => {
    await apiClient.delete(`/api/jobs/${jobId}/save`);
  },

  report: async (jobId: number, reason: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      `/api/jobs/${jobId}/report`,
      { reason },
    );
    return data;
  },
};

// Candidates API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const candidatesApi = {
  getAll: async (): Promise<Candidate[]> => {
    throw new Error("Candidates endpoint not implemented in backend");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: async (_id: number): Promise<Candidate> => {
    throw new Error("Candidate endpoint not implemented in backend");
  },

  update: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _candidateData: Partial<Candidate>,
  ): Promise<Candidate> => {
    throw new Error("Update candidate endpoint not implemented in backend");
  },

  uploadCV: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _file: File,
  ): Promise<{ cv_file_path: string }> => {
    throw new Error("CV upload endpoint not implemented in backend");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSavedJobs: async (_id: number): Promise<SavedJob[]> => {
    throw new Error("Saved jobs endpoint not implemented in backend");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getApplications: async (_id: number): Promise<Application[]> => {
    throw new Error("Applications endpoint not implemented in backend");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSkill: async (_id: number, _skillId: number): Promise<void> => {
    throw new Error("Add skill endpoint not implemented in backend");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeSkill: async (_id: number, _skillId: number): Promise<void> => {
    throw new Error("Remove skill endpoint not implemented in backend");
  },

  getRandom: async (): Promise<SuggestedPerson[]> => {
    const { data } = await apiClient.get<SuggestedPerson[]>(
      "/api/candidates/random",
    );
    return data;
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
    const { data } = await apiClient.get<Employer>(`/api/employers/${id}`);
    return data;
  },

  update: async (
    id: number,
    employerData: Partial<Employer>,
  ): Promise<Employer> => {
    const { data } = await apiClient.put<Employer>(
      `/api/employers/${id}`,
      employerData,
    );
    return data;
  },

  getRandom: async (): Promise<SuggestedPerson[]> => {
    const { data } = await apiClient.get<SuggestedPerson[]>(
      "/api/employers/random",
    );
    return data;
  },
};

// Connections API
export const connectionsApi = {
  sendRequest: async (receiverId: number): Promise<void> => {
    await apiClient.post("/api/connections/request", {
      receiver_id: receiverId,
    });
  },

  getAll: async (): Promise<{
    received: ConnectionRequest[];
    sent: ConnectionRequest[];
  }> => {
    const { data } = await apiClient.get<{
      received: ConnectionRequest[];
      sent: ConnectionRequest[];
    }>("/api/connections/requests");
    return data;
  },

  accept: async (requestId: number): Promise<void> => {
    await apiClient.put(`/api/connections/requests/${requestId}/accept`);
  },

  reject: async (requestId: number): Promise<void> => {
    await apiClient.put(`/api/connections/requests/${requestId}/reject`);
  },

  getConnections: async (): Promise<Connection[]> => {
    const { data } = await apiClient.get<Connection[]>("/api/connections/");
    return data;
  },

  removeConnection: async (connectionId: number): Promise<void> => {
    await apiClient.delete(`/api/connections/${connectionId}`);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get<Notification[]>("/api/notifications/");
    return data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/api/notifications/${notificationId}/read`);
  },
};

// Search API
export const searchApi = {
  search: async (query: string) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    const { data } = await apiClient.get<{
      employers: Array<{ id: number; role: string; full_name: string; headLine: string; image?: string }>;
      candidates: Array<{ id: number; role: string; full_name: string; headLine: string; image?: string }>;
      jobs: Array<{ id: number; title: string; description: string }>;
    }>(`/api/search?${params.toString()}`);

    return data;
  },
};

// Applications API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const applicationsApi = {
  getAll: async (): Promise<Application[]> => {
    throw new Error("Applications endpoint not implemented in backend");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getByJobId: async (_jobId: number): Promise<Application[]> => {
    throw new Error("Job applications endpoint not implemented in backend");
  },

  update: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _status: Application["status"],
  ): Promise<Application> => {
    throw new Error("Update application endpoint not implemented in backend");
  },
};

// AI Recommendations API
// Note: These endpoints don't exist in the backend yet
// Stubbing them out for now
export const aiApi = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recommendJobs: async (_candidateId: number): Promise<RecommendedJob[]> => {
    // Return empty array for now since endpoint doesn't exist
    return [];
  },

  recommendCandidates: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _jobId: number,
  ): Promise<RecommendedCandidate[]> => {
    // Return empty array for now since endpoint doesn't exist
    return [];
  },
};
