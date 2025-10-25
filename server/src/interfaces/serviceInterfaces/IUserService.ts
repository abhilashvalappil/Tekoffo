
import {  FreelancerData } from "../entities/IJob"
import { IUser, ProfileFormData,UserProfileResponse } from "../entities/IUser"
 

export interface IUserService {
    createUserProfile(userId:string, data: ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    getUserProfile(userId:string): Promise<{userProfile:IUser | null}> 
    updateUserProfile(userId:string,updateProfileData:ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    changePassword(userId:string, currentPassword:string, newPassword:string): Promise<{message:string}>
    getAllFreelancers(): Promise<{freelancers:FreelancerData[]}>
    createCheckout(data: {
        totalAmount: number;
        proposalId: string;
        clientId: string;
        freelancerId: string;
      }):Promise<{url:string | null,sessionId:string}>
    getChatPartner(receiverId:string): Promise<{receiver:IUser | null}>
}