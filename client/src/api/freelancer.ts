
import API from '../services/api'
import {userENDPOINTS } from '../constants/endpointUrl'
import { handleApiError } from '../utils/errors/errorHandler'

interface StripeAccountResponse {
    onboardingLink: string;
}


export const submitProposal = async(proposalDetails:FormData) => {
    try {
        await API.post(userENDPOINTS.SUBMIT_PROPOSAL,proposalDetails,{
            headers: {
                'Content-Type': 'multipart/form-data',  
              },
            })
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}


export const checkStripeAccount = async(): Promise<boolean> => {
    try {
        const response = await API.get(userENDPOINTS.GET_STRIPE_ACCOUNT)
        const { hasStripeAccount } = response.data;
        console.log('console from commonts api checkstripe: ',hasStripeAccount)
        return  hasStripeAccount
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const createConnectedStripeAccount = async(email:string): Promise<StripeAccountResponse> => {
    try {
        const response = await API.get(userENDPOINTS.CREATE_STRIPE_CONNECT,{params:{email}})
        return response.data.url;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

interface BackendProposal {
    _id: string;
    jobId: {
      _id: string;
      title: string;
    };
    clientId: {
      _id: string;
      fullName: string;
    };
    proposedBudget: number;
    duration: string;
    status: 'accepted' | 'rejected' | 'pending';
    createdAt: string;
  }

export const fetchAppliedProposalsByFreelancer = async(): Promise<BackendProposal[]> => {
    try {
        const response= await API.get(userENDPOINTS.FREELANCER_APPLIED_PROPOSALS)
        return response.data.proposals;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}