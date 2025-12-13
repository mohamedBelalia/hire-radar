export interface CandidateProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  profile_picture?: string;
  skills: string[];
  experience_years?: number;
  education?: string;
  cv_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  company_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  profile_picture?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  description?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateCandidateProfileRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

export interface UpdateEmployerProfileRequest {
  company_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  description?: string;
  linkedin_url?: string;
}

export interface UploadCVResponse {
  cv_url: string;
  message: string;
}
