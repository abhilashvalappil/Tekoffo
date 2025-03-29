import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    _id:string;
    username:string;
    email:string;
    role: UserRole;
    password:string;
    googleId?: string;
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
    role: UserRole;
}

export interface SignUpData {
    username: string;
    email: string;
    password: string;
    role: string;
  }
