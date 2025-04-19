
import {  FreelancerData, JobData, JobDataType, JobInputData, JobUpdateData } from "../entities/IJob"
import { ICategory } from "../entities/ICategory"
import { ProfileFormData,UserProfileResponse } from "../entities/IUser"

export interface IUserService {
    createUserProfile(userId:string, data: ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    updateUserProfile(userId:string,updateProfileData:ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>
    changePassword(userId:string, currentPassword:string, newPassword:string): Promise<{message:string}>
    fetchCategories(): Promise<{categories: ICategory[]}>
    postJob(clientId:string, jobData:JobInputData): Promise<{message:string}>
    fetchMyJobPosts(clientId:string): Promise<{jobs:JobDataType[]}> 
    getAllJobs(): Promise<{jobs:JobData}>
    getAllFreelancers(): Promise<{freelancers:FreelancerData[]}>
    updateJobPost(clientId:string, jobData:JobUpdateData): Promise<{message:string}>
    deleteJobPost(clientId:string,id:string): Promise<{message:string}>
}