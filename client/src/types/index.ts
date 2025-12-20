// User types
// Note: /auth/me endpoint only returns: id, full_name, email, role, image
// candidate_id and employer_id are not returned by the backend
export type User = {
  id: number;
  full_name: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  image?: string | null;
  created_at?: string;
  // These are not returned by /auth/me - will need to be fetched separately or derived
  candidate_id?: number;
  employer_id?: number;
};

// Job types
// Backend returns: id (string), title, description, company_name, employer_id (string),
// location, salary_min, salary_max, salary_currency, employment_type, experience_level,
// skills, requirements, benefits, application_deadline, posted_at, updated_at
export type Job = {
  id: number; // Converted from string in API
  employer_id: number; // Converted from string in API
  title: string;
  company?: string; // Legacy field
  company_name: string;
  location: string | null;
  salary_range?: string | null; // Legacy field
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  emp_type?: string | null; // Legacy field
  employment_type?: string | null;
  experience_level?: string | null;
  description: string;
  skills?: string[] | null;
  requirements?: string | null;
  benefits?: string | null;
  responsibilities?: string[] | null; // Legacy field
  application_deadline?: string | null;
  posted_at?: string;
  created_at?: string; // Legacy field - use posted_at
  updated_at?: string;
  is_saved?: boolean; // Frontend-only flag
  is_applied?: boolean; // Frontend-only flag
};

export type JobFilters = {
  search?: string;
  location?: string;
  salary_min?: number;
  skill?: string;
  limit?: number;
  offset?: number;
};

export type JobsResponse = {
  jobs: Job[];
  total: number;
  limit: number;
  offset: number;
};

// Candidate types
export type Candidate = {
  id: number;
  user_id: number;
  phone?: string | null;
  bio?: string | null;
  experience_years?: number | null;
  education?: string | null;
  cv_file_path?: string | null;
  skills?: CandidateSkill[];
  user?: User;
};

export type CandidateSkill = {
  id: number;
  skill_id: number;
  candidate_id: number;
  skill?: Skill;
};

export type Skill = {
  id: number;
  name: string;
};

// Employer types
export type Employer = {
  id: number;
  user_id: number;
  company_name: string;
  company_description?: string | null;
  website?: string | null;
  industry?: string | null;
  company_size?: string | null;
  user?: User;
  jobs?: Job[];
};

// Application types
export type Application = {
  id: number;
  job_id: number;
  candidate_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter?: string | null;
  applied_at?: string;
  job?: Job;
  candidate?: Candidate;
};

// AI Recommendation types
export type RecommendedJob = Job & {
  match_score?: number;
};

export type RecommendedCandidate = Candidate & {
  match_score?: number;
};

export type AIRecommendationsResponse = {
  jobs?: RecommendedJob[];
  candidates?: RecommendedCandidate[];
};

// Saved Job type
export type SavedJob = {
  id: number;
  job_id: number;
  candidate_id: number;
  saved_at?: string;
  job?: Job;
};
