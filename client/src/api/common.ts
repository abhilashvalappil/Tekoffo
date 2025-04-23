

import API from '../services/api'
import { commonENDPOINTS,userENDPOINTS } from '../constants/endpointUrl'
import {SingUpFormData,Passwords} from '../types/auth'
import { fetchedCategories } from '../types/admin'
import { FreelancerData, JobFormData } from '../types/userTypes'
import { ProposalData, proposalDataType } from '../types/proposalTypes'


export const signUp = async(userData:SingUpFormData) => {
    try {
        const response = await API.post(commonENDPOINTS.SIGNUP,userData)
        return response.data;
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Error occured in signup';
        throw new Error(errorMessage);
    }
}   

export const resetPassword = async(email:string) => {
    try {
        const response = await API.post(commonENDPOINTS.FORGOT_PASS,{email})
        return response.data;
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Error occurred in resetpassword';
        return { success: false, message: errorMessage };
    }
}

export const changePassword = async(passwords:Passwords) => {
    try {
        const result = await API.put(userENDPOINTS.CHANGE_PASSWORD,{passwords})
        return result.data
    } catch (error:any) {
        console.log('console from api/common.tsss changepassword',typeof error, 'heeloooo',error, 'status',error.response.status)
        const errorMessage = error.response?.data?.message || 'Error occurred in change password';
        return { success: false, message: errorMessage };
    }
}

export const fetchListedCategories = async(): Promise<fetchedCategories[]> => {
    try {
        const result = await API.get(userENDPOINTS.GET_LISTED_CATEGORIES)
        console.log('console from common.tss',result.data.categories)
        return result.data.categories || [];
         
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch categoriesa';
        throw new Error(errorMessage);
    }
}

export const postJob = async(jobDetails:JobFormData) => {
    try {
        await API.post(userENDPOINTS.POST_JOB,jobDetails)
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to post Job';
        throw new Error(errorMessage);
    }
}

export const updateJobPost = async(jobData:JobFormData) => {
    try {
        
        const response = await API.put(userENDPOINTS.UPDATE_JOB_POST,jobData);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to post Job';
        throw new Error(errorMessage);
    }
}

export const deleteJobPost = async(id:string) => {
    try {
         await API.delete(userENDPOINTS.DELETE_JOB_POST,{data:{id}})
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to post Job';
        throw new Error(errorMessage);
    }
}

export const fetchJobs = async (): Promise<JobFormData[]> => {
    try {
        const result = await API.get(userENDPOINTS.GET_MY_JOBS);
        console.log('consoleeeeeeee from common.tssssxx',result.data )
        return result.data || [];
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch Jobs';
        throw new Error(errorMessage);
    }
}

export const getAllFreelancers = async(): Promise<FreelancerData[]> =>{
    try {
        const result = await API.get(userENDPOINTS.GET_Freelancers)
        console.log('console from commonts getallfreelancrs',result.data)
        return result.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch freelancers';
        throw new Error(errorMessage);
    }
}

export const sendProposal = async(proposalDetails:FormData) => {
    try {
        await API.post(userENDPOINTS.SEND_PROPOSAL,proposalDetails,{
            headers: {
                'Content-Type': 'multipart/form-data',  
              },
            })
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to send Proposal';
        throw new Error(errorMessage);
    }
}

export const fetchProposalsReceived = async(): Promise<ProposalData[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_RECEIVED_PROPOSALS)
        console.log('console from commonts',response.data)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch Proposals';
        throw new Error(errorMessage);
    }
}