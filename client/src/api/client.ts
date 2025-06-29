import API from '../services/api'
import { userENDPOINTS } from '../constants/endpointUrl'
import { fetchedCategories } from '../types/admin'
import { FreelancerData, Job, JobFormData } from '../types/userTypes'
import { ProposalData, ProposalFilters } from '../types/proposalTypes'
import { handleApiError } from '../utils/errors/errorHandler'
import { PaymentIntentPayload } from '../types/paymentTypes'
import { PaginatedResponse } from '../types/commonTypes'
import { FreelancerGigListDTO } from '../types/gigTypes'
import { JobDataType } from '../types/invitationTypes'


export const fetchListedCategories = async(): Promise<fetchedCategories[]> => {
    try {
        const result = await API.get(userENDPOINTS.GET_LISTED_CATEGORIES)
        return result.data.categories || [];
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const createJob = async(jobDetails:JobFormData): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.CREATE_JOB,jobDetails)
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const updateJobPost = async(jobData:Job) => {
    try {
        const response = await API.put(userENDPOINTS.UPDATE_JOB_POST,jobData);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const deleteJobPost = async(id:string) => {
    try {
         await API.delete(userENDPOINTS.DELETE_JOB_POST,{data:{id}})
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchJobs = async (page?:number, limit?:number,search?: string, filters?: Record<string, string>): Promise<PaginatedResponse<Job>> => {
    try {
        const result = await API.get(userENDPOINTS.GET_MY_JOBS,{ params: { page, limit,search, ...filters }});
        return result.data.paginatedResponse || [];
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const getAllFreelancers = async(): Promise<FreelancerData[]> =>{
    try {
        const result = await API.get(userENDPOINTS.GET_Freelancers)
        return result.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const getReceivedProposals = async(page:number, limit:number,search?: string, filters?:ProposalFilters): Promise<PaginatedResponse<ProposalData>> => {
    try {
        const response = await API.get(userENDPOINTS.GET_RECEIVED_PROPOSALS,{params:{page,limit,search, ...filters}})
        return response.data
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchAndUpdateProposal = async(proposalId:string,status:string): Promise<ProposalData> => {
    try {
        const response = await API.put(userENDPOINTS.UPDATE_PROPOSAL,{proposalId,status})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchProposal = async(proposalId:string): Promise<ProposalData> => {
    try {
        const response = await API.post(userENDPOINTS.GET_PROPOSAL,{proposalId})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const createPaymentIntent = async(paymentIntentData:PaymentIntentPayload): Promise<{clientSecret:string,transactionId:string}> => {
    try {
        const response = await API.post(userENDPOINTS.CREATE_PAYMENT_INTENT,{paymentIntentData})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const createContract = async(transactionId:string): Promise<void> =>{
    try {
        await API.post(userENDPOINTS.CREATE_CONTRACT,{transactionId})
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const approveContract = async(contractId:string,stripePaymentIntentId:string,transactionId:string): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.APPROVE_CONTRACT,{contractId,stripePaymentIntentId,transactionId})
        return response.data
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const submitReview = async(reviewedUserId:string,reviewData:{ rating: number; review: string },contractId:string): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.CREATE_REVIEW,{reviewedUserId,reviewData,contractId})
        return response.data
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchFreelancersGigs = async(page?:number, limit?:number, search?: string): Promise<PaginatedResponse<FreelancerGigListDTO>> => {
    try {
        const response = await API.get(userENDPOINTS.GET_GIGS,{ params: { page, limit,search}})
        return response.data.gigs;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const inviteFreelancerToJob = async(jobId:string, freelancerId:string): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.CREATE_JOB_INVITE,{jobId,freelancerId})
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchInvitationsSent = async(search?: string, filters?:ProposalFilters): Promise<ProposalData[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_INVITATIONS_SENT,{params:{search, ...filters}})
        return response.data.invitations;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchActiveJobPosts = async(): Promise<{ count: number, jobs: JobDataType[], completed: number, activeContracts:number }> => {
    try {
        const response = await API.get(userENDPOINTS.GET_ACTIVE_JOBS)
         return {
            count: response.data.count,
            jobs: response.data.jobs,
            completed:response.data.completed,
            activeContracts:response.data.activeContracts
        };
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}