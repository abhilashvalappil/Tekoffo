 
export interface User {
  _id?: string;
  fullName?: string; 
  companyName?:string;
  description?: string;
  country?: string;
  profilePicture?: string;
  skills?: string[];
  preferredJobFields?: string[];
  username: string;
  email: string;
  total_Spent?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  role: UserRole;
}
export enum UserRole {
    Client = 'client',
    Freelancer = 'freelancer',
    Admin = 'admin',
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated:boolean;
    successMessage: string | null;
}

export interface RegisterPayload {
    email: string;
    otp: string;
  }

export interface SignInCredentials {
    identifier: string;
    password: string;
}

 
export interface SignInResponse {
  message: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    fullName?: string;
    companyName?: string;
    description?: string;
    country?: string;
    profilePicture?: string;
    skills?: string[];
    preferredJobFields?: string[];
    total_Spent?: number;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  accessToken: string;
}

export interface GoogleSignUpCredentials {
    credential: string;
}