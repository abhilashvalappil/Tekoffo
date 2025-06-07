import bcrypt from "bcrypt";
import { IUserService,IUserRepository,ProfileFormData,UserProfileResponse,ICategoryRepository,IJobRepository,IProposalRepository, IUser,  } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { CustomError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { FreelancerData } from '../interfaces/entities/IJob';
import { IPaymentRepository } from "../interfaces/repositoryInterfaces/IPaymentRepository";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export class UserService implements IUserService {
    private userRepository: IUserRepository;
    private categoryRepository:ICategoryRepository;
    private jobRepository: IJobRepository;
    private proposalRepository:IProposalRepository;
    private paymentRepository: IPaymentRepository;
    private stripe: Stripe;

    constructor(userRepository: IUserRepository, categoryRepository:ICategoryRepository, jobRepository: IJobRepository, proposalRepository:IProposalRepository, paymentRepository: IPaymentRepository){
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        this.paymentRepository = paymentRepository;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
        // this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

    }

    async createUserProfile(userId:string, ProfileData:ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}> {
       
            const user = await this.userRepository.findUserById(userId)
            if(!user){
                throw new NotFoundError(MESSAGES.INVALID_USER)
            }

            const isFreelancer = user.role === 'freelancer';

            if (isFreelancer && (!ProfileData.skills || !ProfileData.preferredJobFields)) {
                throw new CustomError('Skills and preferred job fields are required for freelancers');
              }

            const skills = typeof ProfileData.skills === 'string' ? JSON.parse(ProfileData.skills) : ProfileData.skills;
            const preferredJobFields =
            typeof ProfileData.preferredJobFields === 'string'
                ? JSON.parse(ProfileData.preferredJobFields)
                : ProfileData.preferredJobFields;

            const createProfile = {
                fullName: ProfileData.fullName,
                companyName: isFreelancer ? undefined : ProfileData.companyName,
                description: ProfileData.description,
                country: ProfileData.country,
                skills: isFreelancer ? ProfileData.skills : undefined,
                preferredJobFields: isFreelancer ? ProfileData.preferredJobFields : undefined,
                linkedinUrl: isFreelancer ? ProfileData.linkedinUrl : undefined,
                githubUrl: isFreelancer ? ProfileData.githubUrl : undefined,
                portfolioUrl: isFreelancer ? ProfileData.portfolioUrl : undefined,
                profilePicture: ProfileData.profilePicture ? ProfileData.profilePicture.path : '', // Use Cloudinary URL
              };

            const saveProfile = await this.userRepository.createUserProfile(userId,createProfile)
            if (!saveProfile) {
                throw new CustomError(MESSAGES.PROFILE_UPDATE_FAILED);  
            }
            return {message:MESSAGES.PROFILE_CREATED,
                userProfile:{
                    _id: saveProfile._id,
                    username: saveProfile.username,
                    role:saveProfile.role,
                    email: saveProfile.email,
                    fullName: saveProfile.fullName,
                    companyName: saveProfile.companyName,
                    description: saveProfile.description,
                    country: saveProfile.country,
                    profilePicture: saveProfile.profilePicture,
                    skills: saveProfile.skills,
                    preferredJobFields: saveProfile.preferredJobFields,
                    linkedinUrl: saveProfile.linkedinUrl,
                    githubUrl: saveProfile.githubUrl,
                    portfolioUrl: saveProfile.portfolioUrl,
                }
            }
    }

    async getUserProfile(userId:string): Promise<{userProfile:IUser | null}> {
      const userProfile = await this.userRepository.findUserById(userId);
      if(!userProfile){
        throw new NotFoundError(MESSAGES.INVALID_USER)
      }
      return{userProfile}
    }

    async updateUserProfile(userId:string,updateProfileData:ProfileFormData): Promise<{message:string,userProfile:UserProfileResponse}>{
        
            const user = await this.userRepository.findUserById(userId)
            if(!user){
                throw new NotFoundError(MESSAGES.INVALID_USER)
            }

            const isFreelancer = user.role === 'freelancer';

            if (isFreelancer && (!updateProfileData.skills || !updateProfileData.preferredJobFields)) {
                throw new CustomError('Skills and preferred job fields are required for freelancers');
              }

              const skills = typeof updateProfileData.skills === 'string' ? JSON.parse(updateProfileData.skills) : updateProfileData.skills;
                const preferredJobFields =
                    typeof updateProfileData.preferredJobFields === 'string'
                    ? JSON.parse(updateProfileData.preferredJobFields)
                    : updateProfileData.preferredJobFields;

            const updateProfile = {
                fullName: updateProfileData.fullName,
                description: updateProfileData.description,
                companyName:updateProfileData.companyName,
                country: updateProfileData.country,
                skills: updateProfileData.skills,
                preferredJobFields: updateProfileData.preferredJobFields,
                linkedinUrl: updateProfileData.linkedinUrl,
                githubUrl: updateProfileData.githubUrl,
                portfolioUrl: updateProfileData.portfolioUrl,
                profilePicture: updateProfileData.profilePicture ? updateProfileData.profilePicture.path : '',
            }
             
            const saveProfile = await this.userRepository.updateUserProfile(userId,updateProfile)

            if (!saveProfile) {
                throw new CustomError(MESSAGES.PROFILE_UPDATE_FAILED);  
            }
            console.log("user profile updateddddddd",saveProfile)

            return{message:MESSAGES.PROFILE_CREATED,
                userProfile:{
                    _id: saveProfile._id,
                    username: saveProfile.username,
                    role:saveProfile.role,
                    email: saveProfile.email,
                    fullName: saveProfile.fullName,
                    companyName: saveProfile.companyName,
                    description: saveProfile.description,
                    country: saveProfile.country,
                    profilePicture: saveProfile.profilePicture,
                    skills: saveProfile.skills,
                    preferredJobFields: saveProfile.preferredJobFields,
                    linkedinUrl: saveProfile.linkedinUrl,
                    githubUrl: saveProfile.githubUrl,
                    portfolioUrl: saveProfile.portfolioUrl,
                }
            }                   
    }

    async changePassword(userId:string, currentPassword:string, newPassword:string): Promise<{message:string}> {

            const user = await this.userRepository.findUserById(userId);

            if (!user) {
                throw new NotFoundError(MESSAGES.INVALID_USER);
            }
            const email = user.email

            const isValidPassword = await bcrypt.compare(currentPassword, user.password);

            if(!isValidPassword){
                throw new UnauthorizedError(MESSAGES.INVALID_CURRENT_PASSWORD)
            }

            newPassword = await bcrypt.hash(newPassword,10);
            await this.userRepository.findByEmailAndUpdate(email,{password:newPassword})

            return {message:MESSAGES.PASSWORD_CHANGED}
    }

    async getAllFreelancers(): Promise<{freelancers:FreelancerData[]}> {
            const freelancers = await this.userRepository.findFreelancers();
            return {freelancers}
    }

    async createCheckout(data: {
        totalAmount: number;
        proposalId: string;
        clientId: string;
        freelancerId: string;
      }): Promise<{ url: string | null; sessionId: string }> {
        
           
          if (!data.totalAmount || data.totalAmount <= 0 || !Number.isInteger(data.totalAmount)) {
            throw new CustomError('Invalid totalAmount: Must be a positive integer in cents' );
          }
          if (!data.proposalId || !data.clientId || !data.freelancerId) {
            throw new CustomError('Missing required fields: proposalId, clientId, or freelancerId' );
          }
          if (!process.env.DOMAIN_URL) {
            throw new CustomError('DOMAIN_URL environment variable is not set' );
          }
          if (!process.env.STRIPE_SECRET_KEY) {
            throw new CustomError('STRIPE_SECRET_KEY environment variable is not set' );
          }
    
          console.log('Creating Stripe checkout session with data:', data); // Debug log
    
          const session = await this.stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Freelancer Job Payment',
                  },
                  unit_amount: data.totalAmount, 
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${process.env.DOMAIN_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.DOMAIN_URL}/payment/cancel`,
            metadata: {
              proposalId: data.proposalId,
              clientId: data.clientId,
              freelancerId: data.freelancerId,
            },
          });
    
          console.log('Stripe session created:', { sessionId: session.id, url: session.url });
          return { url: session.url, sessionId: session.id };
    }

    async getReceiver(receiverId:string): Promise<{receiver:IUser | null}> {
      const receiver = await this.userRepository.findUserById(receiverId)
      return{receiver}
    }

}