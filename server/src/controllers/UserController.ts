
import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces"; 
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import { profileSchema,freelancerProfileSchema } from "../validations/profilevalidation";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
 


interface AuthRequest extends Request {
    userId?: string;  
  }


export class UserController {
    private userService: IUserService;
    private stripe: Stripe;

    constructor(userService: IUserService){
        this.userService = userService;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });

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
 
    async createFreelancerProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
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

            const parsedSkills = typeof skills === 'string'
            ? skills.split(',').map((s) => s.trim()).filter(Boolean)
            : skills;

        const parsedPreferredJobFields = typeof preferredJobFields === 'string'
            ? preferredJobFields.split(',').map((f) => f.trim()).filter(Boolean)
            : preferredJobFields;

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

    async getUserProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.query.userId;
            if(!userId || typeof userId !== 'string'){
                res.status(Http_Status.BAD_REQUEST).json({error: MESSAGES.UNAUTHORIZED})
                return;
            }
            const {userProfile} = await this.userService.getUserProfile(userId)
            res.status(Http_Status.OK).json({userProfile})
        } catch (error) {
            next(error)
        }
    }

    async updateFreelancerProfile(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {

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
            });
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

    async getReceiver(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const {receiverId} = req.body;
            const {receiver} = await this.userService.getReceiver(receiverId)
            res.status(Http_Status.OK).json(receiver)
        } catch (error) {
            next(error)
        }
    }

    async createCheckout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
          const { totalAmount, proposalId, clientId, freelancerId } = req.body;
    
          if (!totalAmount || !proposalId || !clientId || !freelancerId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
          }
    
          const { url } = await this.userService.createCheckout({
            totalAmount,
            proposalId,
            clientId,
            freelancerId,
          });
    
          res.status(200).json({ url });
        } catch (error) {
            next(error)
        }
      }

}