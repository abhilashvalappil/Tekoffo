
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
    // getClientReceivedProposals(clientId:string): Promise<{proposals:IProposal[]}> 
    // updateProposalStatus(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}>
    // getProposal(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}>
    // checkStripeAccount(freelancerId:string): Promise<boolean>
    // createStripeAccount(freelancerId:string, email:string): Promise<void>
    // createStripeAccount(freelancerId:string, email:string): Promise<{onboardingLink:string}> 
    createCheckout(data: {
        totalAmount: number;
        proposalId: string;
        clientId: string;
        freelancerId: string;
      }):Promise<{url:string | null,sessionId:string}>
      handlePaymentSuccess(sessionId:string): Promise<void>
    //   createPaymentIntent(amount: number, freelancerId: string, clientId: string, jobId: string,  proposalId: string): Promise<{ clientSecret: string; transactionId: string }>
}