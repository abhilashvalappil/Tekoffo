import API from '../services/api'
import { userENDPOINTS } from '../constants/endpointUrl'
import { fetchedCategories } from '../types/admin'
import { FreelancerData, JobFormData } from '../types/userTypes'
import { ProposalData } from '../types/proposalTypes'
import { handleApiError } from '../utils/errors/errorHandler'
import { PaymentIntentPayload } from '../types/paymentTypes'
import { PaginatedResponse } from '../types/commonTypes'


export const fetchListedCategories = async(): Promise<fetchedCategories[]> => {
    try {
        const result = await API.get(userENDPOINTS.GET_LISTED_CATEGORIES)
        return result.data.categories || [];
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}


export const createJob = async(jobDetails:JobFormData) => {
    try {
        await API.post(userENDPOINTS.CREATE_JOB,jobDetails)
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const updateJobPost = async(jobData:JobFormData) => {
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

export const fetchJobs = async (page = 1, limit = 3): Promise<PaginatedResponse<JobFormData>> => {
    try {
        const result = await API.get(userENDPOINTS.GET_MY_JOBS,{ params: { page, limit }});
        console.log('console from fetchjobsssss',result.data)
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

export const getReceivedProposals = async(): Promise<ProposalData[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_RECEIVED_PROPOSALS)
        return response.data
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchAndUpdateProposal = async(proposalId:string): Promise<ProposalData> => {
    try {
        const response = await API.put(userENDPOINTS.UPDATE_PROPOSAL,{proposalId})
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
        console.log('console from submit reviewwwwwwwwww',reviewedUserId,reviewData,contractId)
        const response = await API.post(userENDPOINTS.CREATE_REVIEW,{reviewedUserId,reviewData,contractId})
        return response.data
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

 

// export const createCheckout = async (data: {
//     totalAmount: number;
//     proposalId: string;
//     clientId: string;
//     freelancerId: string;
//   }) => {
//     try {
//       const response = await API.post(userENDPOINTS.CREATE_CHECKOUT, data);
//       return response.data; 
//     } catch (error) {
//       console.error('Error creating checkout session:', error);
//       throw new Error('Failed to create checkout session');
//     }
//   };