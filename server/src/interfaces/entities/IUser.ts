import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    _id:string;
    username:string;
    email:string;
    role: UserRole;
    password:string;
    googleId?: string;
    isBlocked?: boolean; 
    //***** */
    fullName: string;
    companyName?:string;
    description:string;
    profilePicture?:string;
    country:string;
    skills?: string[];
    preferredJobFields?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
}

export enum UserRole {
    Client = 'client',
    Freelancer = 'freelancer',
    Admin = 'admin',
}
 
export interface IUserResponse {
    _id: string;
    email: string;
    username: string;
    role: string;
    fullName?: string;
    companyName?: string;
    description?: string;
    country?: string;
    skills?: string[];
    preferredJobFields?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    profilePicture?: string;
  }

export interface SignUpData {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }

//   export interface ProfileFormData {
//     fullName: string;
//     companyName: string;
//     description: string;
//     country: string;
//     // profilePicture: string;
//     profilePicture?: Express.Multer.File;
//   }

export interface ProfileFormData {
    fullName: string;
    companyName?: string;  
    description: string;
    country: string;
    skills?: string[];  
    preferredJobFields?: string[];  
    linkedinUrl?: string;  
    githubUrl?: string;  
    portfolioUrl?: string;  
    profilePicture?: Express.Multer.File;  
  }

//   export interface UserProfileResponse {
//       _id: string;
//       fullName: string;
//       companyName?: string;
//       description: string;
//       country: string;
//     //   profilePicture?: string;
//     profilePicture?: string;
//     };
  
export interface UserProfileResponse {
    _id: string;
    username: string;
    role:string;
    email: string;
    fullName: string;
    companyName?: string;
    description?: string;
    country: string;
    profilePicture?: string;
    skills?: string[];
    preferredJobFields?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  }
  