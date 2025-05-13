import bcrypt from "bcrypt";
import {IJobService, IUserRepository,UserProfileResponse,ICategory,ICategoryRepository,IJobRepository,IProposalRepository, IUser, CreateGigDTO, IGigRepository, IGig, UpdateGigDTO,  } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { ConflictError, CustomError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { FreelancerData, JobDataType, JobInputData, JobUpdateData } from '../interfaces/entities/IJob';
import { proposalDataType } from "../types/jobTypes";
import { Types } from "mongoose";
import { IProposal } from "../interfaces/entities/IProposal";
import { IPaymentRepository } from "../interfaces/repositoryInterfaces/IPaymentRepository";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
import { PaginatedResponse } from "../types/commonTypes";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });


export class JobService implements IJobService{
    private categoryRepository:ICategoryRepository;
    private userRepository: IUserRepository;
    private jobRepository: IJobRepository;
    private proposalRepository:IProposalRepository;
    private gigRepository: IGigRepository;


    constructor(categoryRepository:ICategoryRepository, userRepository: IUserRepository, jobRepository: IJobRepository, proposalRepository:IProposalRepository, gigRepository:IGigRepository){
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        this.gigRepository = gigRepository;
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

        const existingJob = await this.jobRepository.findJobById(jobData.id);
        if (!existingJob || existingJob.clientId.toString() !== clientId) {
            throw new NotFoundError(MESSAGES.INVALID_JOB);
        }

        const savedJob = await this.jobRepository.updateJobPost(jobData.id!, {
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
        const deletePost = await this.jobRepository.findJobAndDelete(id);
        return {message:MESSAGES.JOB_DELETED_SUCCESSFULLY}
    }

    async getMyJobPosts(clientId:string, page: number, limit: number): Promise<PaginatedResponse<JobDataType>> {
     
        const user = await this.userRepository.findUserById(clientId)
        if(!user){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const skip = (page - 1) * limit;
        const [jobs,total] = await Promise.all([
            this.jobRepository.findJobsByClientId(clientId,skip, limit),
            this.jobRepository.countJobs()
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

   async getAllJobs(page: number, limit: number): Promise<{jobs:PaginatedResponse<JobDataType>}> {

        const skip = (page - 1) * limit;
        const [jobs,total] = await Promise.all([
             this.jobRepository.findAllJobs(skip, limit),
             this.jobRepository.countJobs()
        ]);
        // return {jobs}
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

    async createJobProposal(freelancerId:string,proposalDetails:proposalDataType): Promise<{message:string}> {
        
        const userExist = await this.userRepository.findUserById(freelancerId);
        if(!userExist){
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
        return{message:MESSAGES.PROPOSAL_CREATED}
    }

    async getClientReceivedProposals(clientId:string, page: number, limit: number): Promise<{proposals:PaginatedResponse<IProposal>}> {

        const userExist = await this.userRepository.findUserById(clientId)
        if(!userExist){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const skip = (page - 1) * limit;
        const [proposals,total] = await Promise.all([
             this.proposalRepository.findProposals(clientId,skip, limit),
             this.proposalRepository.countProposals(),
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

    async updateProposalStatus(proposalId: string, clientId: string): Promise<{proposal:IProposal | null}> {

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
            const proposal = await this.proposalRepository.updateProposalStatusToAccepted(proposalId)
            return {proposal}
        }

    async getFreelancerAppliedProposals(freelancerId:string,page:number,limit:number): Promise<{proposals: PaginatedResponse<IProposal>}> {
        const userExist = await this.userRepository.findUserById(freelancerId)
        const skip = (page - 1) * limit;
        const [proposals,total] = await Promise.all([
            this.proposalRepository.findAppliedProposalsByFreelancer(freelancerId,skip,limit),
            this.proposalRepository.countProposals()
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
}