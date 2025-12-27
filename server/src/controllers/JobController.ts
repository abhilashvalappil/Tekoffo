import { Request, Response, NextFunction } from "express";
import { IJobService } from "../interfaces"; 
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import { JobFormSchema,UpdateJobInputSchema } from "../validations/jobValidation";
import { GigFormSchema } from "../validations/gigValidation";
import { ZodIssue } from 'zod';
import dotenv from "dotenv";
import { ValidationError } from "../errors/customErrors";
dotenv.config();
import { SortOption } from "../interfaces/entities/IProposal";


interface AuthRequest extends Request {
    userId?: string;  
  }

export class JobController {
    private jobService: IJobService;

    constructor(jobService: IJobService){
        this.jobService = jobService;
    }

    async getCategories(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {categories} = await this.jobService.fetchCategories();
             res.status(Http_Status.OK).json({success: true, categories})
        } catch (error) {
            next(error)
        }
    }

    async createJob(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
             
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const validationResult = JobFormSchema.safeParse(req.body);
            if (!validationResult.success) {
                const errors = validationResult.error.issues.map((issue: ZodIssue) => ({
                  field: issue.path[0],
                  message: issue.message,
                }));
                res.status(Http_Status.BAD_REQUEST).json({error: 'Validation failed',
                  details: errors,
                });
                return;
              }
              const jobData = validationResult.data;
              const {message} = await this.jobService.createJob(clientId,jobData)
              res.status(Http_Status.CREATED).json(message)
        } catch (error) {
            next(error)
        }
    }

    async updateJob(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const { jobId } = req.params;

            const validationResult = UpdateJobInputSchema.safeParse(req.body);
            if (!validationResult.success) {
                const errors = validationResult.error.issues.map((issue: ZodIssue) => ({
                  field: issue.path[0],
                  message: issue.message,
                }));
                res.status(Http_Status.BAD_REQUEST).json({error: 'Validation failed',details: errors,});
                return;
              }
              
            const jobData = validationResult.data;
            const {message} = await this.jobService.updateJob(clientId, jobId, jobData)
            res.status(Http_Status.OK).json(message)
        } catch (error) {
            next(error)
        }
    }

    async deleteJob(req:AuthRequest, res:Response, next: NextFunction): Promise<void>{
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {id} = req.params;

            if(!id){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.INVALID_REQUEST_DELETION})
            }
            const message = this.jobService.deleteJob(clientId,id)
            res.status(Http_Status.NO_CONTENT).json(message)
        } catch (error) {
            next(error)
        }
    }

    async getClientJobs(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const category = req.query.category as string;
            const subCategory = req.query.subCategory as string;


            if (isNaN(page) || page < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
              }

            if (isNaN(limit) || limit < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
            }

            const paginatedResponse = await this.jobService.getClientJobs(clientId,page, limit,search,{ status, category, subCategory });
            res.status(Http_Status.OK).json({ success: true, paginatedResponse });
        } catch (error) {
            next(error)
        }
    }

    async getActiveJobPosts(req:AuthRequest, res:Response, next: NextFunction): Promise<void>{
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.UNAUTHORIZED).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const {count,jobs,completed,activeContracts} = await this.jobService.getActiveJobPosts(clientId)
            res.status(Http_Status.OK).json({count,jobs,completed,activeContracts})
        } catch (error) {
            next(error)
        }
    }

    async getJobs(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = req.query.search as string;
            const category = req.query.category as string;
            const subCategory = req.query.subCategory as string;
            const budgetRange = req.query.budgetRange as string;

            if (isNaN(page) || page < 1) {
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
             }
            if (isNaN(limit) || limit < 1) {
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
             }
            
             const {jobs} = await this.jobService.getJobs(page, limit, search, {category, subCategory, budgetRange});
             res.status(Http_Status.OK).json(jobs)
        } catch (error) {
            next(error)
        }
    }

    async getClientProfileByJob(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const {clientId} = req.params;
            console.log('checking clieniddd',clientId)
            if(typeof clientId !== 'string' || !clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.CLIENT_ID_MISSING})
                return;
            }
            const {clientProfile} = await this.jobService.getClientProfileByJob(clientId) 
            res.status(Http_Status.OK).json(clientProfile)
        } catch (error) {
            next(error)
        }
    }

    async createProposal(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const proposalDetails = {
                jobId: req.body.jobId,
                clientId: req.body.clientId,
                coverLetter: req.body.coverLetter,
                proposedBudget: Number(req.body.proposedBudget),
                duration: req.body.duration,
                };
                
            const file = req.file;
            // console.log('Uploaded fileeeeeee:', file);
            const {message} = await this.jobService.createProposal(freelancerId,{
                ...proposalDetails,
                attachments:file ? file : undefined
            })
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

     async getProposalsByClient(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
            try {
                const clientId = req.userId;
                if(!clientId){
                    res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                    return;
                }

                const page = parseInt(req.query.page as string) || 1;
                const limit = parseInt(req.query.limit as string) || 8;
                const search = req.query.search as string;
                const status = req.query.status as string;
                const time = req.query.time as string;

                if (isNaN(page) || page < 1) {
                    res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
                }
                if (isNaN(limit) || limit < 1) {
                    res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
                }

                const { proposals } = await this.jobService.getProposalsByClient(clientId,page,limit,search,{status,time})
                res.status(Http_Status.OK).json(proposals);
            } catch (error) {
                next(error)
            }
    }

    async getProposalById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>{
        try {
         
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const { proposalId } = req.params; 
            if(!proposalId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {proposal} = await this.jobService.getProposalById(proposalId, clientId)
            res.status(Http_Status.OK).json(proposal)
        } catch (error) {
            next(error)
        }
    }

    async updateProposalStatus(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const { proposalId } = req.params;
            const { status } = req.body;
            const {proposal} = await this.jobService.updateProposalStatus(proposalId,status, userId)
            res.status(Http_Status.OK).json(proposal)
        } catch (error) {
            next(error)
        }
    }

    async getProposalsByFreelancer(req:AuthRequest, res:Response, next:NextFunction): Promise<void>{
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = req.query.search as string;
            const filter = req.query.filter as string;

            if (isNaN(page) || page < 1) {
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
            }
            if (isNaN(limit) || limit < 1) {
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
            }
            const {proposals} = await this.jobService.getProposalsByFreelancer(freelancerId,page,limit,search,filter)
            res.status(Http_Status.OK).json({proposals})
        } catch (error) {
            next(error)
        }
    }

    async createGig(req:AuthRequest, res:Response, next:NextFunction): Promise<void>{
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
             const validationResult = GigFormSchema.safeParse(req.body);
              if (!validationResult.success) {
                const errors = validationResult.error.issues.map((issue: ZodIssue) => ({
                  field: issue.path[0],
                  message: issue.message,
                }));
                res.status(Http_Status.BAD_REQUEST).json({error: 'Validation failed',
                  details: errors,
                });
                return;
              }
              const gigData = validationResult.data;
              const {message} = await this.jobService.createGig(freelancerId,gigData)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

    async getMyGigs(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {gigs} = await this.jobService.getMyGigs(freelancerId)
            res.status(Http_Status.OK).json({gigs})
        } catch (error) {
            next(error)
        }
    }

    async updateGig(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const gigId = req.params.id;
            const {message} = await this.jobService.updateGig(freelancerId,gigId,req.body)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

    async deleteGig(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            console.log('gigid receivxxxxxx')
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
             const { id: gigId } = req.params;
            const {message} = await this.jobService.deleteGig(freelancerId,gigId)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

    async getFreelancersGigs(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = req.query.search as string;

            if (isNaN(page) || page < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
              }
            if (isNaN(limit) || limit < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
            }

            const  gigs  = await this.jobService.getFreelancersGigs(clientId, page, limit,search)
            res.status(Http_Status.OK).json({gigs})
        } catch (error) {
            next(error)
        }
    }

    async createFreelancerJobInvitation(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {jobId,freelancerId} = req.body;
            if(!jobId || !freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.ALL_FIELDS_REQUIRED})
            }
            const {message} = await this.jobService.createFreelancerJobInvitation(clientId,jobId,freelancerId)
            res.status(Http_Status.CREATED).json({message})
        } catch (error) {
            next(error)
        }
    }

    async getSentInvitations(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const search = req.query.search as string;
            const status = req.query.status as string;
            const time = req.query.time as string;

            const {invitations} = await this.jobService.getSentInvitations(clientId,search,{status,time})
            res.status(Http_Status.OK).json({invitations})
        } catch (error) {
            next(error)
        }
    }

    async getJobInvitations(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = req.query.search as string;
            const sortBy = (req.query.sortBy as SortOption) || 'newest';

            if (isNaN(page) || page < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
            }

            if (isNaN(limit) || limit < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
            }

            const {invitations} = await this.jobService.getJobInvitations(freelancerId,page, limit,search,sortBy)
            res.status(Http_Status.OK).json({invitations})
        } catch (error) {
            next(error)
        }
    }

    async getJob(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const {jobId} = req.params;
            if (typeof jobId !== 'string'){
                throw new ValidationError(MESSAGES.INVALID_JOB_ID)
            }
            const {jobData} = await this.jobService.getJob(jobId)
            res.status(Http_Status.OK).json({jobData})
        } catch (error) {
            next(error)
        }
    }

    async acceptInvitaion(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
             if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const proposalId = req.params.id;
            const {message} = await this.jobService.acceptJobInvitation(freelancerId,proposalId)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

    async rejectInvitaion(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
             if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const proposalId = req.params.id;
            const {message} = await this.jobService.rejectInvitaion(freelancerId,proposalId)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }
    
}