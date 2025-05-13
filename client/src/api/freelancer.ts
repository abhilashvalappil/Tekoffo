
import API from '../services/api'
import {userENDPOINTS } from '../constants/endpointUrl'
import { handleApiError } from '../utils/errors/errorHandler'
import { AppliedProposal } from '../types/proposalTypes';
import { PaginatedResponse } from '../types/commonTypes';
import { CreateGigDTO,Gig } from '../types/gigTypes';

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


export const fetchAppliedProposalsByFreelancer = async(page:number,limit:number): Promise<PaginatedResponse<AppliedProposal>> => {
    try {
        const response= await API.get(userENDPOINTS.FREELANCER_APPLIED_PROPOSALS,{params:{page,limit}})
        // console.log('console from freelancer applied proposals',response.data.proposals)
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

export const createGig = async(gigData:CreateGigDTO): Promise<string> => {
    try {
        console.log('console from creategig api',gigData)
        const response = await API.post(userENDPOINTS.CREATE_GIG,gigData)
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchGigs = async(): Promise<Gig[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_GIGS)
        return response.data.gigs;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const updateGig = async(formData:Gig): Promise<string> => {
    try {
        const response = await API.put(userENDPOINTS.UPDATE_GIG,formData)
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const deleteGig = async(gigId:string): Promise<string> => {
    try {
        const response = await API.delete(userENDPOINTS.DELETE_GIG,{data:{gigId}})
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}