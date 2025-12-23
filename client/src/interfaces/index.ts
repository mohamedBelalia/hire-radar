export interface Job {
  id: number;
  _id?: string;                  // Database ID
  title: string;                  // Job title
  company: string;                // Company name
  location: string;               // Job location
  salary_range?: string;          // Salary range (optional)
  emp_type?: string;              // Employment type (full-time, part-time, etc.)
  description?: string;           // Job description
  responsibilities?: string[];    // Array of responsibilities
  skills?: string[];              // Array of skill names required for the job
  createdAt?: string;             // Creation timestamp
  updatedAt?: string;             // Updated timestamp
  category?: string;
  applicants?: number;
  employer_id?: number;
  employer?: {
    id: number;
    full_name: string;
    image?: string;
    headLine?: string;
  };
}
