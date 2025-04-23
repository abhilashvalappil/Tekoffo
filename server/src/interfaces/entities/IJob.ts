import { Document, Types, ObjectId } from 'mongoose'

 export interface JobDataType extends Document {
  _id:string;
  clientId: Client | Types.ObjectId;
    title: string;
    category: string;
    subCategory:string;
    description:string;
    // requirements:string;
    requirements: string[];
    budget:number;
    duration:string;
    status: 'open' | 'inprogress' | 'completed';
    isBlocked: boolean;
    created_At: Date;
    updated_At: Date;
  }

  export interface Client {
    name: string;
    profilePicture?: string;
  }

  export interface JobInputData {
    title: string;
    category: string;
    subCategory: string;
    description: string;
    requirements: string[];
    budget: number;
    duration: string;
}
  export interface JobUpdateData {
    id:string;
    title: string;
    category: string;
    subCategory: string;
    description: string;
    requirements: string[];
    budget: number;
    duration: string;
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

 