export interface Job {
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
}



export interface LoginForm {
    username: string,
    password: string,
}

export interface RegisterForm extends LoginForm {
    name: string,
}

export interface UpdateProfileForm {
    name: string,
    username: string, 
    profile_picture?: string,
    newPassword?: string,
    retypePassword?: string,
    oldPassword?: string,
}

export interface Conversation {
    _id: string,
    participants : any[],
    lastMessage: string,
    updatedAt: string,
    api: any
}

export interface Message {
    _id: string, 
    sender: any,
    text: string,
    isRead?: boolean,
    createdAt: Date
}

export interface UserData{
    _id: string,
    name: string, 
    username: string,
    password: string,
    profile_picture?: string,
    profilePictureUrl?: string,
}