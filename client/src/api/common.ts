
import API from '../services/api'
import { commonENDPOINTS,userENDPOINTS } from '../constants/endpointUrl'
import {SingUpFormData,Passwords} from '../types/auth'
import { fetchedCategories } from '../types/admin'
import { FreelancerData, JobFormData } from '../types/userTypes'



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
        const result = await API.post(userENDPOINTS.POST_JOB,jobDetails)
        console.log('console from common.tsssss',result)
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to post Job';
        throw new Error(errorMessage);
    }
}

export const updateJobPost = async(jobData:JobFormData) => {
    try {
        console.log('console from comon.ts updatejobbb',jobData)
        const response = await API.put(userENDPOINTS.UPDATE_JOB_POST,jobData);
        console.log('consoel from newwwwwwwwww',response.data)
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to post Job';
        throw new Error(errorMessage);
    }
}

export const deleteJobPost = async(id:string) => {
    try {
        const response = await API.delete(userENDPOINTS.DELETE_JOB_POST,{data:{id}})
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