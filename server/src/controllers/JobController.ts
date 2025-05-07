import { Request, Response, NextFunction } from "express";
import { IJobService } from "../interfaces"; 
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import { JobFormSchema,UpdateJobInputSchema } from "../validations/jobValidation";
import { ZodIssue } from 'zod';
import dotenv from "dotenv";
dotenv.config();
 


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
              res.status(Http_Status.CREATED).json({success:true, message})
        } catch (error) {
            next(error)
        }
    }

    async updateJobPost(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const validationResult = UpdateJobInputSchema.safeParse(req.body);
            if (!validationResult.success) {
                const errors = validationResult.error.issues.map((issue: ZodIssue) => ({
                  field: issue.path[0],
                  message: issue.message,
                }));
                res.status(Http_Status.BAD_REQUEST).json({error: 'Validation failed',details: errors,});
                return;
              }

            const {id, title, category, subCategory, requirements, description, budget, duration} = req.body;
            if (!id || !title || !category || !subCategory || !requirements || !description || !budget || !duration) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.MISSING_CREDENTIALS });
            }
            const jobData = validationResult.data;
            const {message} = await this.jobService.updateJobPost(clientId,jobData)
            res.status(Http_Status.CREATED).json(message)
        } catch (error) {
            next(error)
        }
    }

    async deleteJobPost(req:AuthRequest, res:Response, next: NextFunction): Promise<void>{
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {id} = req.body;

            if(!id){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.INVALID_REQUEST_DELETION})
            }
            const message = this.jobService.deleteJobPost(clientId,id)
            res.status(Http_Status.NO_CONTENT).json(message)
        } catch (error) {
            next(error)
        }
    }

    async getMyJobPosts(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;

            if (isNaN(page) || page < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
              }

            if (isNaN(limit) || limit < 1){
                res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
            }

            const paginatedResponse = await this.jobService.getMyJobPosts(clientId,page, limit);
            res.status(Http_Status.OK).json({ success: true, paginatedResponse });
        } catch (error) {
            next(error)
        }
    }

    async getAvailbleJobs(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
             const {jobs} = await this.jobService.getAllJobs();
             res.status(Http_Status.OK).json({success:true, jobs})
        } catch (error) {
            next(error)
        }
    }

    async getClientProfileByJob(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const {clientId} = req.query;
            // console.log('console from usercontroller getClientProfileByJob',clientId)

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
            // const {proposalDetails} = req.body;
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            // console.log('console from createproposal controler',req.body)
            const proposalDetails = {
                jobId: req.body.jobId,
                clientId: req.body.clientId,
                coverLetter: req.body.coverLetter,
                proposedBudget: Number(req.body.proposedBudget),
                duration: req.body.duration,
                };
                
            const file = req.file;
            console.log('Uploaded fileeeeeee:', file);
            await this.jobService.createJobProposal(freelancerId,{
                ...proposalDetails,
                //  attachments: file ? [{ fileName: file.filename }] : undefined
                attachments:file ? file : undefined
            })
        } catch (error) {
            next(error)
        }
    }

     async getReceivedProposals(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
            try {
                const clientId = req.userId;
                if(!clientId){
                    res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                    return;
                }
                const { proposals } = await this.jobService.getClientReceivedProposals(clientId)
                res.status(Http_Status.OK).json(proposals);
            } catch (error) {
                next(error)
            }
    }

    async getProposal(req: AuthRequest, res: Response, next: NextFunction): Promise<void>{
        try {
         
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {proposalId} = req.body;
            if(!proposalId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {proposal} = await this.jobService.getProposal(proposalId, clientId)
            res.status(Http_Status.OK).json(proposal)
        } catch (error) {
            next(error)
        }
    }

    async updateProposalStatus(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            console.log('Raw req.body:', req.body);

            // console.log('console from update propsoal controller',req.body.proposalId)
            const clientId = req.userId;
            if(!clientId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {proposalId} = req.body;
            const {proposal} = await this.jobService.updateProposalStatus(proposalId, clientId)
            res.status(Http_Status.OK).json(proposal)
        } catch (error) {
            next(error)
        }
    }

    async getFreelancerAppliedProposals(req:AuthRequest, res:Response, next:NextFunction): Promise<void>{
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {proposals} = await this.jobService.getFreelancerAppliedProposals(freelancerId)
            res.status(Http_Status.OK).json({proposals})
        } catch (error) {
            next(error)
        }
    }
}