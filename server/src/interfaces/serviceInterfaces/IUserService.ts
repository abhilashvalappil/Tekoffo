
import {  FreelancerData, JobDataType, JobInputData, JobUpdateData } from "../entities/IJob"
import { ICategory } from "../entities/ICategory"
import { IUser, ProfileFormData,UserProfileResponse } from "../entities/IUser"
import { proposalDataType } from "../../types/jobTypes"
import { IProposal } from "../entities/IProposal"

export interface IUserService {
    createUserProfile(userId:string, data: ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    updateUserProfile(userId:string,updateProfileData:ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    changePassword(userId:string, currentPassword:string, newPassword:string): Promise<{message:string}>
    getAllFreelancers(): Promise<{freelancers:FreelancerData[]}>
    createCheckout(data: {
        totalAmount: number;
        proposalId: string;
        clientId: string;
        freelancerId: string;
      }):Promise<{url:string | null,sessionId:string}>
    getReceiver(receiverId:string): Promise<{receiver:IUser | null}>
}