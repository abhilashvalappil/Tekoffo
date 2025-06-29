

import API from '../services/api'
import { commonENDPOINTS,userENDPOINTS } from '../constants/endpointUrl'
import {SingUpFormData,Passwords} from '../types/auth'
import { handleApiError } from '../utils/errors/errorHandler'
import { IFrontendPopulatedReview, IReview } from '../types/review'
import { ChatPartner, SocketMessage } from '../types/messageTypes'
import { INotification } from '../types/notificationTypes'
 

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


export const fetchChatPartner = async(receiverId: string): Promise<ChatPartner> => {
    try {
        const response = await API.post(userENDPOINTS.GET_RECEIVER,{receiverId})
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

//* fetch by reviewerId
export const fetchSubmittedReviews = async(): Promise<IReview[]> =>{
    try {
        const response = await API.get(userENDPOINTS.GET_SUBMITTED_REVIEWS)
        return response.data.reviews;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchReviews = async(userId:string): Promise<IFrontendPopulatedReview[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_REVIEWS,{params:{userId}})
        return response.data.reviews;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const deleteMessageApi = async(messageId:string): Promise<SocketMessage> => {
    try {
        const response = await API.put(userENDPOINTS.DELETE_MSG,{messageId})
        return response.data.message;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchUnreadChatCount = async(): Promise<number> => {
    try {
        const response = await API.get(userENDPOINTS.GET_UNREAD_MESSAGES)
        return response.data.count;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchNotifications = async(): Promise<INotification[]> => {
    try {
        const response = await API.get(userENDPOINTS.GET_NOTIFICATIONS)
        return response.data.notifications;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const markNotificationAsRead = async(notificationId: string): Promise<void> => {
    try {
        await API.put(userENDPOINTS.MARK_AS_READ(notificationId))
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const markAllNotificationsAsRead = async(): Promise<void> => {
    try {
        await API.put(userENDPOINTS.MARK_ALL_NOTIFICATIONS_AS_READ)
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}



 



 

