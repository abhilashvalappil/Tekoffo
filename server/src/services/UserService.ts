import bcrypt from "bcrypt";
import { IUserService,IUserRepository,ProfileFormData,UserProfileResponse,ICategory,ICategoryRepository,IJobRepository,IProposalRepository, IUser } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { CustomError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { FreelancerData, JobDataType, JobInputData, JobUpdateData } from '../interfaces/entities/IJob';
import { proposalDataType } from "../types/jobTypes";
import { Types } from "mongoose";
import { IProposal } from "../interfaces/entities/IProposal";
 

export class UserService implements IUserService {
    private userRepository: IUserRepository;
    private categoryRepository:ICategoryRepository;
    private jobRepository: IJobRepository;
    private proposalRepository:IProposalRepository

    constructor(userRepository: IUserRepository, categoryRepository:ICategoryRepository, jobRepository: IJobRepository, proposalRepository:IProposalRepository){
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
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
            console.log("user profile savedddddddd",saveProfile)
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

    async fetchCategories(): Promise<{categories: ICategory[]}> {
            const categories = await this.categoryRepository.getListedCategories()
            return {categories}
    }

    async postJob(clientId:string, jobData:JobInputData): Promise<{message:string}> {
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

            // const savedJob = await this.jobRepository.updateJobPost(clientId,jobData)
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

    async fetchMyJobPosts(clientId:string): Promise<{jobs:JobDataType[]}> {
     
            const user = await this.userRepository.findUserById(clientId)
            if(!user){
                throw new NotFoundError(MESSAGES.INVALID_USER)
            }
            const jobs = await this.jobRepository.findJobsByClientId(clientId);
            return {jobs} ;
      }


    async getAllJobs(): Promise<{jobs:JobDataType[]}> {
   
        const jobs = await this.jobRepository.findAllJobs();
            return {jobs}
    }

    async getAllFreelancers(): Promise<{freelancers:FreelancerData[]}> {
            const freelancers = await this.userRepository.findFreelancers();
            return {freelancers}
    }
    
    async getClientProfileByJob(clientId:string): Promise<{clientProfile:Partial<IUser> | null}>{
        
        const clientProfile = await this.userRepository.findUserById(clientId);
        if(!clientProfile){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        return {clientProfile}
    }

    async createJobProposal(freelancerId:string,proposalDetails:proposalDataType): Promise<{message:string}> {
        console.log('console from service proposaldetails',proposalDetails)
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
}