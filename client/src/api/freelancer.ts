
import API from '../services/api'
import {userENDPOINTS } from '../constants/endpointUrl'
import { handleApiError } from '../utils/errors/errorHandler'
import { AppliedProposal } from '../types/proposalTypes';

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


export const fetchAppliedProposalsByFreelancer = async(): Promise<AppliedProposal[]> => {
    try {
        const response= await API.get(userENDPOINTS.FREELANCER_APPLIED_PROPOSALS)
        return response.data.proposals;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const submitContract = async(contractId:string): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.SUBMIT_CONTRACT,{contractId})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}