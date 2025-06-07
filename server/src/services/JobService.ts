
import {IJobService, IUserRepository,ICategory,ICategoryRepository,IJobRepository,IProposalRepository, IUser, CreateGigDTO, IGigRepository, IGig, UpdateGigDTO, IContractRepository,  } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { JobDataType, JobInputData, JobUpdateData } from '../interfaces/entities/IJob';
import { proposalDataType } from "../types/jobTypes";
import { Types } from "mongoose";
import { IAppliedProposal, IProposal, JobInvitationView, SortOption } from "../interfaces/entities/IProposal";
import { ProposalStatus } from "../interfaces/entities/IProposal";
// import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
// import { v4 as uuidv4 } from 'uuid';
import { PaginatedResponse } from "../types/commonTypes";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });


export class JobService implements IJobService{
    private categoryRepository:ICategoryRepository;
    private userRepository: IUserRepository;
    private jobRepository: IJobRepository;
    private proposalRepository:IProposalRepository;
    private gigRepository: IGigRepository;
    private contractRepository: IContractRepository;


    constructor(categoryRepository:ICategoryRepository, userRepository: IUserRepository, jobRepository: IJobRepository, proposalRepository:IProposalRepository, gigRepository:IGigRepository, contractRepository: IContractRepository){
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        this.gigRepository = gigRepository;
        this.contractRepository = contractRepository;
    }

    async fetchCategories(): Promise<{categories: ICategory[]}> {
        const categories = await this.categoryRepository.getListedCategories()
        return {categories}
    }
    
    async createJob(clientId:string, jobData:JobInputData): Promise<{message:string}> {

        const user = await this.userRepository.findUserById(clientId)
        if(!user){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        await this.jobRepository.createJobPost(clientId,jobData)
        return {message:MESSAGES.JOB_CREATED_SUCCESSFULLY}
    }

    async updateJobPost(clientId:string, jobData:JobUpdateData): Promise<{message:string}> {
  
        const user = await this.userRepository.findUserById(clientId)

        if(!user){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }

        const existingJob = await this.jobRepository.findJobById(jobData._id);
        if (!existingJob || existingJob.clientId.toString() !== clientId) {
            throw new NotFoundError(MESSAGES.INVALID_JOB);
        }

       await this.jobRepository.updateJobPost(jobData._id!, {
            title: jobData.title,
            category: jobData.category,
            subCategory: jobData.subCategory,
            requirements:jobData.requirements,  
            description: jobData.description,
            budget: jobData.budget,
            duration: jobData.duration,
            updated_At: new Date()
        });
        return {message:MESSAGES.JOB_UPDATED_SUCCESSFULLY}
    }

    async deleteJobPost(clientId:string,id:string): Promise<{message:string}>{
       
        const user = await this.userRepository.findUserById(clientId)

        if(!user){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        } 

        const existingJob = await this.jobRepository.findJobById(id);
        if (!existingJob || existingJob.clientId.toString() !== clientId) {
            throw new NotFoundError(MESSAGES.INVALID_JOB);
        }
        await this.jobRepository.findJobAndDelete(id);
        return {message:MESSAGES.JOB_DELETED_SUCCESSFULLY}
    }

    async getMyJobPosts(clientId:string, page: number, limit: number,search?:string,filters?: { status?: string; category?: string; subCategory?: string }): Promise<PaginatedResponse<JobDataType>> {
     
        const user = await this.userRepository.findUserById(clientId)
        if(!user){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const skip = (page - 1) * limit;
        const [jobs,total] = await Promise.all([
            this.jobRepository.findJobsByClientId(clientId,skip, limit, search, filters),
            this.jobRepository.countJobsByClientId(clientId, search, filters)
        ]) 
        // return {jobs} ;
        return{
            data: jobs,
            meta:{
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            }
        }
   }

   async getActiveJobPosts(clientId:string): Promise<{ count: number; jobs: JobDataType[],completed:number, activeContracts:number}> {
    const client = await this.userRepository.findUserById(clientId)
    if (!client) {
      throw new NotFoundError(MESSAGES.INVALID_USER);
    }
    const [count, jobs, completed, activeContracts] = await Promise.all([
        this.jobRepository.findActiveJobsCountByUserId(clientId),
        this.jobRepository.findActiveJobPostsByUserId(clientId),
         this.jobRepository.findCompletedJobsCountByUserId(clientId),
         this.contractRepository.countActiveContractsByClientId(clientId)
    ]);
    return { count, jobs,completed, activeContracts };
   }

   async getAllJobs(page: number, limit: number, search?: string, filters?: { category?: string; subCategory?: string; budgetRange?: string }): Promise<{jobs:PaginatedResponse<JobDataType>}> {
        const skip = (page - 1) * limit;
        const [jobs,total] = await Promise.all([
             this.jobRepository.findAllJobs(skip, limit, search, filters),
            //  this.jobRepository.findActiveJobsCount()
            this.jobRepository.countFilteredJobs(search, filters)
        ]);
        return {
            jobs:{
            data: jobs,
            meta: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        } };
    }

    async getClientProfileByJob(clientId:string): Promise<{clientProfile:Partial<IUser> | null}>{
            
        const clientProfile = await this.userRepository.findUserById(clientId);
        if(!clientProfile){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        return {clientProfile}
    }

    async createProposal(freelancerId:string,proposalDetails:proposalDataType): Promise<{message:string}> {
        
        const freelancer = await this.userRepository.findUserById(freelancerId);
        if(!freelancer){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const jobExist = await this.jobRepository.findJobById(proposalDetails.jobId.toString());
        if(!jobExist){
            throw new NotFoundError(MESSAGES.JOB_NOT_FOUND)
        }
        const proposalData = {
            ...proposalDetails,
            attachments:proposalDetails.attachments? proposalDetails.attachments.path : '', 
            freelancerId: new Types.ObjectId(freelancerId)
        }
        
        await this.proposalRepository.createProposal(proposalData)
        return{message:MESSAGES.JOB_APPLIED}
    }

    async getClientReceivedProposals(clientId:string, page: number, limit: number): Promise<{proposals:PaginatedResponse<IProposal>}> {

        const userExist = await this.userRepository.findUserById(clientId)
        if(!userExist){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const skip = (page - 1) * limit;
        const [proposals,total] = await Promise.all([
             this.proposalRepository.findProposals(clientId,skip, limit),
             this.proposalRepository.countReceivedProposals(clientId),
        ])
        return{proposals:{
            data:proposals,
            meta:{
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            }
        }}
    }

    async getProposal(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}> {
    
        const userExist = await this.userRepository.findUserById(clientId)
        if(!userExist){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const proposalExist = await this.proposalRepository.findProposalById(proposalId);
        if(!proposalExist){
            throw new NotFoundError(MESSAGES.PROPOSAL_NOT_FOUND)
        }
        if (proposalExist.clientId.toString() !== clientId) {
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
        }
        const proposal = await this.proposalRepository.findProposalDetails(proposalId)
        return {proposal}
    }

    async updateProposalStatus(proposalId: string,status: string, userId: string): Promise<{proposal:IProposal | null}> {

            const userExist = await this.userRepository.findUserById(userId)
            if(!userExist){
                throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
            }
            const proposalExist = await this.proposalRepository.findProposalById(proposalId);
            if(!proposalExist){
                throw new NotFoundError(MESSAGES.PROPOSAL_NOT_FOUND)
            }
            const proposal = await this.proposalRepository.updateProposalStatus(proposalId,status as ProposalStatus)
            return {proposal}
        }

    async getFreelancerAppliedProposals(freelancerId:string,page:number,limit:number, search?: string, filter?: string): Promise<{proposals: PaginatedResponse<IAppliedProposal>}> {
        const userExist = await this.userRepository.findUserById(freelancerId)
         if(!userExist){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED )
        }
        const skip = (page - 1) * limit;
        const [proposals,total] = await Promise.all([
            this.proposalRepository.findAppliedProposalsByFreelancer(freelancerId,skip,limit, search, filter),
            this.proposalRepository.countAppliedProposals(freelancerId, search, filter)
        ])
        return{
            proposals:{
                data:proposals,
                meta:{
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit,
                }
            }
        }
    }
    
    async createGig(freelancerId:string,gigData:CreateGigDTO): Promise<{message:string}> {
        const freelancer = await this.userRepository.findUserById(freelancerId);
        if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const gigCount = await this.gigRepository.findGigCountByFreelancerId(freelancerId)
        if(gigCount >= 3){
            throw new ConflictError(MESSAGES.GIG_MAX_LIMIT_REACHED)
        }
        await this.gigRepository.createGig(freelancerId,gigData)
        return{message:MESSAGES.GIG_CREATED}
    }

    async getFreelancerGigs(freelancerId:string): Promise<{gigs:IGig[] | null}> {
        const freelancer = await this.userRepository.findUserById(freelancerId);
        if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const gigs = await this.gigRepository.findGigsByFreelancerId(freelancerId)
        return {gigs}
    }

    async updateFreelancerGig(freelancerId:string,gigData:UpdateGigDTO): Promise<{message:string}> {
        const freelancer = await this.userRepository.findUserById(freelancerId);
        if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const existingGig = await this.gigRepository.findGigById(gigData._id)
        if(!existingGig){
            throw new NotFoundError(MESSAGES.GIG_NOT_FOUND)
        }
        await this.gigRepository.findByIdAndUpdate(gigData._id,gigData)
        return{message:MESSAGES.GIG_UPDATED}
    }

    async deleteFreelancerGig(freelancerId:string, gigId:string): Promise<{message:string}> {
        const freelancer = await this.userRepository.findUserById(freelancerId);
        if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const existingGig = await this.gigRepository.findGigById(gigId)
        if(!existingGig){
            throw new NotFoundError(MESSAGES.GIG_NOT_FOUND)
        }
        await this.gigRepository.findGigByIdAndDelete(gigId)
        return{message:MESSAGES.GIG_DELETED}
    }

    async getFreelancersGigs(clientId:string, page: number, limit: number): Promise<PaginatedResponse<IGig>> {
        const client = await this.userRepository.findUserById(clientId)
        if(!client){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const skip = (page - 1) * limit;

        const [gigs,total] = await Promise.all([
            this.gigRepository.findGigs(skip, limit),
            this.gigRepository.countGigs()
         ])

        // const gigs = await this.gigRepository.findGigs()
        // return{gigs}
        return{
            data: gigs,
            meta:{
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            }
        }
    }

    async createFreelancerJobInvitation(clientId:string,jobId:string,freelancerId:string): Promise<{message:string}> {
        const client = await this.userRepository.findUserById(clientId)
        if(!client){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const freelancer = await this.userRepository.findUserById(freelancerId)
        if(!freelancer){
            throw new NotFoundError(MESSAGES.FREELANCER_NOT_FOUND)
        }
        const job = await this.jobRepository.findJobById(jobId)
        if(!job){
            throw new NotFoundError(MESSAGES.JOB_NOT_FOUND)
        }
        const{budget,duration,} = job
        const proposalData: Partial<IProposal> = {
            jobId: new Types.ObjectId(jobId),
            freelancerId: new Types.ObjectId(freelancerId),
            clientId: new Types.ObjectId(clientId),
            proposalType:"client-invited",
            status:'invited',
            proposedBudget:budget,
            duration
        }
        await this.proposalRepository.createProposal(proposalData)
        return{message:MESSAGES.JOB_INVITATION_SENT}
    }

    async getSentInvitations(clientId:string): Promise<{invitations:IProposal[]}> {
        const client = await this.userRepository.findUserById(clientId)
        if(!client){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const invitations = await this.proposalRepository.findInvitationsSent(clientId)
        return{invitations}
    }

    async getJobInvitations(freelancerId:string,page: number, limit: number,search?:string,sortBy?:SortOption): Promise<{invitations:PaginatedResponse<JobInvitationView>}> {
        const freelancer = await this.userRepository.findUserById(freelancerId);
        if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }

        const skip = (page - 1) * limit;
        const [invitations,total] = await Promise.all([
            this.proposalRepository.findJobInvitations(freelancerId,skip, limit, search,sortBy),
            this.proposalRepository.countJobInvitesByFreelancer(freelancerId,search)
        ]) 
        return {
            invitations:{
            data: invitations,
            meta: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        } };
    }

    async getJobDetails(jobId:string): Promise<{jobData:JobDataType}>{
        const jobData = await this.jobRepository.findJobById(jobId)
        if(!jobData){
            throw new NotFoundError(MESSAGES.JOB_NOT_FOUND)
        }
        return {jobData}
    }

    async acceptJobInvitation(freelancerId:string,proposalId:string): Promise<{message:string}>{
        const freelancer = await this.userRepository.findUserById(freelancerId)
         if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }

        const proposalExist = await this.proposalRepository.findProposalById(proposalId);
        if(!proposalExist){
            throw new NotFoundError(MESSAGES.PROPOSAL_NOT_FOUND)
        }
        const updatedStatus = ProposalStatus.PENDING;
        await this.proposalRepository.updateProposalStatus(proposalId,updatedStatus)
        return{message:MESSAGES.INVITATION_ACCEPTED}
    }

    async rejectInvitaion(freelancerId:string,proposalId:string): Promise<{message:string}> {
        const freelancer = await this.userRepository.findUserById(freelancerId)
         if(!freelancer){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const proposalExist = await this.proposalRepository.findProposalById(proposalId);
        if(!proposalExist){
            throw new NotFoundError(MESSAGES.PROPOSAL_NOT_FOUND)
        }
        const updatedStatus = ProposalStatus.REJECTED;
        await this.proposalRepository.updateProposalStatus(proposalId,updatedStatus)
        return{message:MESSAGES.INVITATION_REJECTED}
    }
}