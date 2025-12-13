export interface Job {
  id: string;
  title: string;
  description: string;
  company_name: string;
  employer_id: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  employment_type?:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "remote";
  experience_level?: "entry" | "mid" | "senior" | "executive";
  skills: string[];
  requirements?: string;
  benefits?: string;
  application_deadline?: string;
  posted_at: string;
  updated_at: string;
  is_saved?: boolean;
}

export interface JobSearchParams {
  search?: string;
  location?: string;
  salary_min?: number;
  skill?: string;
  page?: number;
  limit?: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SaveJobResponse {
  message: string;
  job_id: string;
  saved: boolean;
}
