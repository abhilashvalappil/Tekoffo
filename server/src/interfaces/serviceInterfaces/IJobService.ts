
import { JobDataType, JobInputData, JobUpdateData } from "../entities/IJob"
import { ICategory } from "../entities/ICategory"
import { IUser } from "../entities/IUser"
import { proposalDataType } from "../../types/jobTypes"
import { IAppliedProposal, IProposal, JobInvitationView, SortOption } from "../entities/IProposal"
import { PaginatedResponse } from "../../types/commonTypes"
import { CreateGigDTO, IGig, UpdateGigDTO } from "../entities/IGig"

export interface IJobService {
    fetchCategories(): Promise<{categories: ICategory[]}>
    createJob(clientId:string, jobData:JobInputData): Promise<{message:string}>
    updateJobPost(clientId:string, jobData:JobUpdateData): Promise<{message:string}>
    deleteJobPost(clientId:string,id:string): Promise<{message:string}>
    // getMyJobPosts(clientId:string, page: number, limit: number): Promise<{jobs:JobDataType[]}> 
    getMyJobPosts(clientId:string, page: number, limit: number,search?:string, filters?: { status?: string; category?: string; subCategory?: string }): Promise<PaginatedResponse<JobDataType>>
    getActiveJobPosts(clientId:string): Promise<{ count: number; jobs: JobDataType[],completed:number, activeContracts:number }>
    getAllJobs(page: number, limit: number,search?: string, filters?: { category?: string; subCategory?: string; budgetRange?: string }): Promise<{jobs:PaginatedResponse<JobDataType>}>
    getClientProfileByJob(clientId:string): Promise<{clientProfile:Partial<IUser> | null}>
    createProposal(freelancerId:string,proposalDetails:proposalDataType): Promise<{message:string}>
    getClientReceivedProposals(clientId:string, page: number, limit: number): Promise<{proposals:PaginatedResponse<IProposal>}>
    getProposal(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}>
    updateProposalStatus(proposalId: string,status: string, userId: string): Promise<{proposal:IProposal | null}>
    getFreelancerAppliedProposals(freelancerId:string,page:number,limit:number, search?: string, filter?: string): Promise<{proposals: PaginatedResponse<IAppliedProposal>}>
    createGig(freelancerId:string,gigData:CreateGigDTO): Promise<{message:string}>
    getFreelancerGigs(freelancerId:string): Promise<{gigs:IGig[] | null}>
    updateFreelancerGig(freelancerId:string,gigData:UpdateGigDTO): Promise<{message:string}>
    deleteFreelancerGig(freelancerId:string, gigId:string): Promise<{message:string}>
    getFreelancersGigs(clientId:string, page: number, limit: number): Promise<PaginatedResponse<IGig>>
    createFreelancerJobInvitation(clientId:string,jobId:string,freelancerId:string): Promise<{message:string}>
    getSentInvitations(clientId:string): Promise<{invitations:IProposal[]}>
    getJobInvitations(freelancerId:string,page: number, limit: number,search?:string,sortBy?:SortOption): Promise<{invitations:PaginatedResponse<JobInvitationView>}>
    getJobDetails(jobId:string): Promise<{jobData:JobDataType}>
    acceptJobInvitation(freelancerId:string,proposalId:string): Promise<{message:string}>
    rejectInvitaion(freelancerId:string,proposalId:string): Promise<{message:string}>
}