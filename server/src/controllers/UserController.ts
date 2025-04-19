
import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces"; 
import { ValidationError } from "../errors/customErrors";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import { profileSchema,freelancerProfileSchema } from "../validations/profilevalidation";
import { JobFormSchema,UpdateJobInputSchema } from "../validations/jobValidation";
import { ZodIssue } from 'zod';



interface AuthRequest extends Request {
    userId?: string;  
  }


export class UserController {
    private userService: IUserService;

    constructor(userService: IUserService){
        this.userService = userService;
    }

    async createProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log("console from usercontroller.tssssss",req.body)
            console.log('Uploaded file:', req.file)

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const validationResult = profileSchema.safeParse(req.body);

            if (!validationResult.success) {
                const errors = validationResult.error.issues.map((issue) => ({
                  field: issue.path[0],
                  message: issue.message,
                }));
                res.status(Http_Status.BAD_REQUEST).json({ error: 'Validation failed', details: errors });
                return;
              }
              const profilePicture = req.file;
            
            // const {fullName, companyName, description, country, profilePicture} = req.body.payload;
            // const { fullName, companyName, description, country } = req.body;
            

            // if(!fullName  || !description || !country){
            //     res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.BASIC_PROFILE_FIELDS_REQUIRED})
            // }


            // const result = await this.userService.createUserProfile(userId, {
            //     fullName,
            //     companyName,
            //     description,
            //     country,
            //     // profilePicture,
            //     profilePicture: profilePicture ? profilePicture : undefined,
            // });
            const result = await this.userService.createUserProfile(userId, {
                ...validationResult.data,
                profilePicture: profilePicture ? profilePicture : undefined,
              });
              
            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message,
                userProfile:result.userProfile
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log("console from updateprofile usercontroller.ts",req.body)
            console.log('Uploaded file from updateprofile:', req.file)

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            
            const { fullName, companyName, description, country } = req.body;
            const profilePicture = req.file;

            if (!fullName || fullName.length < 3) {
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.FULL_NAME_REQUIRED})
            }

            if (!description || description.length < 8) {
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.DESCRIPTION_REQUIRED})
            }

            if (!country || country.length < 3){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.COUNTRY_REQUIRED})
            }

            if(companyName && companyName.length < 3){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.COMPANY_NAME_MIN_LENGTH})
            }

            if (profilePicture && !['image/jpeg', 'image/png', 'image/jpg'].includes(profilePicture.mimetype)){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.INVALID_PROFILE_PICTURE_FORMAT})
            }

            if (profilePicture && profilePicture.size > 5 * 1024 * 1024){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.PROFILE_PICTURE_SIZE_LIMIT})
            }
            
            const result = await this.userService.updateUserProfile(userId, {
                fullName,
                companyName,
                description,
                country,
                profilePicture: profilePicture ? profilePicture : undefined,
            });
            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message,
                userProfile:result.userProfile
            })
            
        } catch (error) {
            next(error)
        }
    }

    async changePassword(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const {currentPassword, newPassword} = req.body.passwords;

            if(!currentPassword || !newPassword){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.MISSING_CREDENTIALS})
            }
            const result = await this.userService.changePassword(userId,currentPassword,newPassword)

            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message
            })
        } catch (error) {
            next(error)
        }
    }

    async getCategories(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {categories} = await this.userService.fetchCategories();
             res.status(Http_Status.OK).json({success: true, categories})
        } catch (error) {
            next(error)
        }
    }

    async postJob(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log('console from usercontrollerrrrrrrrrrr',req.body)
            
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

            // const {title, category, subCategory, requirements, description, budget, duration} = req.body;
            // if (!title || !category || !subCategory || !Array.isArray(requirements) || requirements.length === 0 || !description || !budget || !duration) {
            //     res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.MISSING_CREDENTIALS });
            //   }
            //   const jobData = { title, category, subCategory, requirements, description, budget, duration };

              const jobData = validationResult.data;
              const {message} = await this.userService.postJob(clientId,jobData)
              res.status(Http_Status.CREATED).json({success:true, message})
        } catch (error) {
            next(error)
        }
    }

    async updateJobPost(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log('console from usercontroller.ts updatejob',req.body)

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

            // const jobData = {id, title, category, subCategory, requirements, description, budget, duration };
            const jobData = validationResult.data;
            const {message} = await this.userService.updateJobPost(clientId,jobData)
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
            console.log('console from usercontrollerrrrr deletejobb',req.body)
            const {id} = req.body;

            if(!id){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.INVALID_REQUEST_DELETION})
            }
            const message = this.userService.deleteJobPost(clientId,id)
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
            const result = await this.userService.fetchMyJobPosts(clientId);
            res.status(Http_Status.OK).json({ success: true, result });
        } catch (error) {
            next(error)
        }
    }

    async createFreelancerProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log("console from freelancer profile usercontroller.tssssss",req.body)
            console.log('Uploaded file:', req.file)

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const { fullName,description,skills, preferredJobFields, country, linkedinUrl, githubUrl, portfolioUrl } = req.body;
            const profilePicture = req.file;

            if(!fullName  || !description || !country || !skills || !preferredJobFields ){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.COMPLETE_PROFILE_FIELDS_REQUIRED})
            }

    //         const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    // const parsedPreferredJobFields =
    //   typeof preferredJobFields === 'string' ? JSON.parse(preferredJobFields) : preferredJobFields;

            const parsedSkills = typeof skills === 'string'
            ? skills.split(',').map((s) => s.trim()).filter(Boolean)
            : skills;

        const parsedPreferredJobFields = typeof preferredJobFields === 'string'
            ? preferredJobFields.split(',').map((f) => f.trim()).filter(Boolean)
            : preferredJobFields;

            // const result = await this.userService.createUserProfile(userId, {
            //     fullName,
            //     description,
            //     country,
            //     skills:parsedSkills,
            //     preferredJobFields:parsedPreferredJobFields,
            //     linkedinUrl,
            //     githubUrl,
            //     portfolioUrl,
            //     profilePicture: profilePicture ? profilePicture : undefined,
            // });

            const rawData = {
                fullName,
                description,
                country,
                skills: parsedSkills,
                preferredJobFields: parsedPreferredJobFields,
                linkedinUrl,
                githubUrl,
                portfolioUrl,
                profilePicture,
              };

            const validation = freelancerProfileSchema.safeParse(rawData);
            if (!validation.success) {
            res.status(Http_Status.BAD_REQUEST).json({
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors,
            });
            return;
            }

            const result = await this.userService.createUserProfile(userId, validation.data);

            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message,
                userProfile:result.userProfile
            })
        } catch (error) {
            next(error)
        }
    }

    async updateFreelancerProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log("console from freelancer updateprofile usercontroller.ts",req.body)
            console.log('Uploaded updateee file:', req.file)

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const { fullName,description,skills, preferredJobFields, country, linkedinUrl, githubUrl, portfolioUrl } = req.body;
            const profilePicture = req.file;

            if(!fullName  || !description || !country || !skills || !preferredJobFields ){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.COMPLETE_PROFILE_FIELDS_REQUIRED})
            }

            const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    const parsedPreferredJobFields =
      typeof preferredJobFields === 'string' ? JSON.parse(preferredJobFields) : preferredJobFields;

            const result = await this.userService.updateUserProfile(userId, {
                fullName,
                description,
                country,
                skills:parsedSkills,
                preferredJobFields:parsedPreferredJobFields,
                linkedinUrl,
                githubUrl,
                portfolioUrl,
                profilePicture: profilePicture ? profilePicture : undefined,
            });
            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message,
                userProfile:result.userProfile
            })

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
             const {jobs} = await this.userService.getAllJobs();
             res.status(Http_Status.OK).json({success:true, jobs})
        } catch (error) {
            next(error)
        }
    }

    async getAllFreelancers(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {freelancers} = await this.userService.getAllFreelancers();
            res.status(Http_Status.OK).json(freelancers)
        } catch (error) {
            next(error)
        }
    }



}