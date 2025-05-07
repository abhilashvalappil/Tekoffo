
import { JobDataType, JobInputData, JobUpdateData } from "../entities/IJob"
import { ICategory } from "../entities/ICategory"
import { IUser } from "../entities/IUser"
import { proposalDataType } from "../../types/jobTypes"
import { IProposal } from "../entities/IProposal"
import { PaginatedResponse } from "../../types/commonTypes"

export interface IJobService {
    fetchCategories(): Promise<{categories: ICategory[]}>
    createJob(clientId:string, jobData:JobInputData): Promise<{message:string}>
    updateJobPost(clientId:string, jobData:JobUpdateData): Promise<{message:string}>
    deleteJobPost(clientId:string,id:string): Promise<{message:string}>
    // getMyJobPosts(clientId:string, page: number, limit: number): Promise<{jobs:JobDataType[]}> 
    getMyJobPosts(clientId:string, page: number, limit: number): Promise<PaginatedResponse<JobDataType>>
    getAllJobs(): Promise<{jobs:JobDataType[]}>
    getClientProfileByJob(clientId:string): Promise<{clientProfile:Partial<IUser> | null}>
    createJobProposal(freelancerId:string,proposalDetails:proposalDataType): Promise<{message:string}>
    getClientReceivedProposals(clientId:string): Promise<{proposals:IProposal[]}> 
    getProposal(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}>
    updateProposalStatus(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}>
    getFreelancerAppliedProposals(freelancerId:string): Promise<{proposals: IProposal[]}>
}