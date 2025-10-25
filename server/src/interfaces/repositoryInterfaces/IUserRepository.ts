import { FreelancerData } from "../entities/IJob";
import { IUser } from "../entities/IUser";

export interface IUserRepository {
    createUser(user: Partial<IUser>): Promise<IUser>;
    findByEmail(email:string): Promise<IUser | null>;
    findByUserName(username: string): Promise<IUser | null>;
    findByEmailOrUsername(identifier: string): Promise<IUser | null>;
    findByEmailAndUpdate(email:string,updateData: Partial<IUser>): Promise<IUser | null>;
    findUserById(userId: string): Promise<IUser | null>;
    findUsers(skip: number, limit: number,search?: string): Promise<IUser[]>
    countUsers(search?: string): Promise<number> 
    getTotalClientsCount(): Promise<number>
    getTotalFreelancersCount(): Promise<number>
    updateUserStatus(userId: string, isBlocked: boolean): Promise<IUser | null>;
    createUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>
    updateUserProfile(userId: string, updateProfile: Partial<IUser>): Promise<IUser | null> 
    findFreelancers(): Promise<FreelancerData[]>
    getStripeAccount(freelancerId: string): Promise<boolean>
}