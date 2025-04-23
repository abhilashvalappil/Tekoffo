
import {  FreelancerData, JobDataType, JobInputData, JobUpdateData } from "../entities/IJob"
import { ICategory } from "../entities/ICategory"
import { IUser, ProfileFormData,UserProfileResponse } from "../entities/IUser"
import { proposalDataType } from "../../types/jobTypes"
import { IProposal } from "../entities/IProposal"

export interface IUserService {
    createUserProfile(userId:string, data: ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    updateUserProfile(userId:string,updateProfileData:ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    changePassword(userId:string, currentPassword:string, newPassword:string): Promise<{message:string}>
    fetchCategories(): Promise<{categories: ICategory[]}>
    postJob(clientId:string, jobData:JobInputData): Promise<{message:string}>
    fetchMyJobPosts(clientId:string): Promise<{jobs:JobDataType[]}> 
    getAllJobs(): Promise<{jobs:JobDataType[]}>
    getAllFreelancers(): Promise<{freelancers:FreelancerData[]}>
    updateJobPost(clientId:string, jobData:JobUpdateData): Promise<{message:string}>
    deleteJobPost(clientId:string,id:string): Promise<{message:string}>
    getClientProfileByJob(clientId:string): Promise<{clientProfile:Partial<IUser> | null}>
    createJobProposal(freelancerId:string,proposalDetails:proposalDataType): Promise<{message:string}>
    getClientReceivedProposals(clientId:string): Promise<{proposals:IProposal[]}> 
}