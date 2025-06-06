

export interface ProfileFormData {
    fullName: string;
    companyName?: string;
    description: string;
    country: string;
    profilePicture?: string | File;
  }


  export interface ProfileState {
    profile: UserProfileResponse | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export interface UserProfileResponse {
    _id: string;
    fullName: string;
    companyName?: string;
    description: string;
    country: string;
    profilePicture?: string;
    skills?: string[];
    preferredJobFields?: string[];
    username: string;
    email: string;
    total_Spent?:number;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    role: UserRole;
    createdAt:string;
  };
  export enum UserRole {
    Client = 'client',
    Freelancer = 'freelancer',
    Admin = 'admin',
}

export interface Job {
  _id: string;
  clientId: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  budget: number;
  duration: string;
  requirements: string[];
  status: string;
  isBlocked: boolean;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  __v: number;
}

export interface JobDataResponse {
  data: Job[];
}


  export interface JobFormData {
    id?: string;
    title: string;
    category: string;
    subCategory:string;
    description:string;
    requirements: string[];
    budget:number;
    duration:string;
    status?: 'open' | 'inprogress' | 'completed';
    isBlocked?: boolean;
    created_At?: Date;
    updated_At?: Date;
  }

  export interface UpdateJobFormData {
    title: string;
    category: string;
    subCategory:string;
    description:string;
    requirements:string;
    budget:number;
    duration:string;
  }

  export interface FreelancerData {
    _id:string;
    email: string;
    fullName: string;
    description: string;
    country: string;
    profilePicture?: string;
    skills?: string[];
    preferredJobFields?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  }
 
  export interface Client {
    id: string;
    fullName: string;
    profilePicture?: string;
    companyName?: string;
    country: string;
    avatarUrl?: string;
    description: string;
    email: string;
  }