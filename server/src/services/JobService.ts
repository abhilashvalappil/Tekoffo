import bcrypt from "bcrypt";
import {IJobService, IUserRepository,UserProfileResponse,ICategory,ICategoryRepository,IJobRepository,IProposalRepository, IUser,  } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { CustomError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
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


    constructor(categoryRepository:ICategoryRepository, userRepository: IUserRepository, jobRepository: IJobRepository, proposalRepository:IProposalRepository){
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        
        // this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
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
        const savedJob = await this.jobRepository.createJobPost(clientId,jobData)
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

   async getAllJobs(): Promise<{jobs:JobDataType[]}> {
        const jobs = await this.jobRepository.findAllJobs();
        return {jobs}
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

    async getClientReceivedProposals(clientId:string): Promise<{proposals:IProposal[]}> {

        const userExist = await this.userRepository.findUserById(clientId)
        if(!userExist){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const proposals = await this.proposalRepository.findProposals(clientId)
        // console.log('console from userservice getClientReceivedProposals',proposals)
        return{proposals}
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

    async getFreelancerAppliedProposals(freelancerId:string): Promise<{proposals: IProposal[]}> {
        const userExist = await this.userRepository.findUserById(freelancerId)
        const proposals = await this.proposalRepository.findAppliedProposalsByFreelancer(freelancerId)
        return {proposals}
    }
    
}