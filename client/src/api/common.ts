

import API from '../services/api'
import { commonENDPOINTS,userENDPOINTS } from '../constants/endpointUrl'
import {SingUpFormData,Passwords} from '../types/auth'
import { handleApiError } from '../utils/errors/errorHandler'
 

export const signUp = async(userData:SingUpFormData) => {
    try {
        const response = await API.post(commonENDPOINTS.SIGNUP,userData)
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}   

export const resetPassword = async(email:string) => {
    try {
        const response = await API.post(commonENDPOINTS.FORGOT_PASS,{email})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const changePassword = async(passwords:Passwords) => {
    try {
        const result = await API.put(userENDPOINTS.CHANGE_PASSWORD,{passwords})
        return result.data
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}


export const fetchReceiver = async(receiverId: string) => {
    try {
        const response = await API.post(userENDPOINTS.GET_RECEIVER,{receiverId})
        // console.log('console from fetch receiverrrrrrr',response.data)
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}
 



 

