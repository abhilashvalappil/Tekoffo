
import API from '../services/api'
import {userENDPOINTS } from '../constants/endpointUrl'
import { handleApiError } from '../utils/errors/errorHandler'
import { AppliedProposal, JobInvitationView } from '../types/proposalTypes';
import { PaginatedResponse } from '../types/commonTypes';
import { CreateGigDTO,Gig } from '../types/gigTypes';
import { JobDataType } from '../types/invitationTypes';
import { Contact, SocketMessage,Message } from '../types/messageTypes';
import { IWallet } from '../types/wallet';
import { ITransaction } from '../types/transaction';
import { UserProfileResponse } from '../types/userTypes';


interface StripeAccountResponse {
    onboardingLink: string;
}
export type SortOption = 'newest' | 'oldest' | 'budget-high' | 'budget-low';

export const submitProposal = async(proposalDetails:FormData): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.SUBMIT_PROPOSAL,proposalDetails,{
            headers: {
                'Content-Type': 'multipart/form-data',  
              }})
            return response.data.message;
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


export const fetchAppliedProposalsByFreelancer = async(page?:number,limit?:number,search?: string, filter?: string): Promise<PaginatedResponse<AppliedProposal>> => {
    try {
        const response= await API.get(userENDPOINTS.FREELANCER_APPLIED_PROPOSALS,{params:{page, limit, search, filter}})
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
        const response = await API.post(userENDPOINTS.CREATE_GIG,gigData)
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchGigs = async(): Promise<Gig[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_FREELANCER_GIGS)
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

export const fetchJobInvitations = async(page:number, limit:number, search?:string,sortBy?: SortOption): Promise<PaginatedResponse<JobInvitationView>> => {
    try {
        const response = await API.get(userENDPOINTS.GET_JOB_INVITATIONS,{params:{page, limit, search, sortBy}})
        return response.data.invitations;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchClientProfile = async(userId:string): Promise<UserProfileResponse> => {
    try {
        const response = await API.get(userENDPOINTS.GET_CLIENT_PROFILE,{params:{userId}})
        return response.data.userProfile;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const acceptInvitation = async(proposalId:string): Promise<string> => {
    try {
        const response = await API.put(userENDPOINTS.ACCEPT_INVITATION,{proposalId})
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchJobData = async(jobId:string): Promise<JobDataType> => {
    try {
        const response = await API.get(userENDPOINTS.GET_JOB_DETAILS,{params:{jobId}})
        return response.data.jobData;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchAndUpdateProposalToReject = async(proposalId:string): Promise<string> => {
    try {
        const response = await API.put(userENDPOINTS.REJECT_INVITATION,{proposalId})
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchChat = async(senderId:string,receiverId:string): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.GET_CHATID,{senderId,receiverId})
        // console.log('console from fetchchat apiiii',response.data)
        return response.data.chat;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const createChat = async(senderId:string,receiverId:string): Promise<string> => {
    try {
        console.log('console from createChat api',senderId,receiverId)
        const response = await API.post(userENDPOINTS.CREATE_CHAT,{senderId,receiverId})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const sendMessage = async (msg: FormData): Promise<Message> => {
    try {
        for (const [key, value] of msg.entries()) {
            console.log(`${key}:`, value);
        }
        const response = await API.post(userENDPOINTS.SEND_MESSAGE, msg, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}


export const fetchChatContacts = async(): Promise<Contact[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_CHATS)
        return response.data.contacts;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchChatMessages = async (chatId:string): Promise<SocketMessage[]> => {
  try {
      const response = await API.get(userENDPOINTS.GET_MESSAGES,{params:{chatId}});
    //   console.log('console from fetchChatMessages',response.data.messages)
      return response.data.messages;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const markMessagesAsRead = async(chatId:string) => {
    try {
        console.log('console from markreaddddd',chatId)
         await API.put(userENDPOINTS.MARK_MESSAGES_AS_READ,{chatId})
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchWallet = async(): Promise<IWallet> => {
    try {
        const response = await API.get<{ wallet: IWallet }>(userENDPOINTS.GET_WALLET)
        return response.data.wallet;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const withdrawAmount = async(amount:number): Promise<string> => {
    try {
        const response = await API.post(userENDPOINTS.WITHDRAW, { amount });
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchTransactions = async(): Promise<ITransaction[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_TRANSACTIONS)
        return response.data.transactions;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchActiveAndCompletedContracts = async(): Promise<{activeContracts:number,completedContracts:number}> => {
    try {
        const response = await API.get(userENDPOINTS.GET_ACTIVE_CONTRACTS)
        return {
            activeContracts: response.data.activeContracts,
            completedContracts: response.data.completedContracts
        }
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}