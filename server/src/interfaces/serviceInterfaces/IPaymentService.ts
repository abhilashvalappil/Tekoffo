import { PaginatedResponse } from "../../types/commonTypes";
import { IContract } from "../entities/IContract";
import { INotification } from "../entities/INotification";



export interface IPaymentService {
    checkStripeAccount(freelancerId:string): Promise<boolean>
    createStripeAccount(freelancerId:string, email:string): Promise<{onboardingLink:string}> 
    createPaymentIntent(amount: number,serviceFee:number, freelancerId: string, clientId: string, jobId: string,  proposalId: string): Promise<{ clientSecret: string; transactionId: string }>
    createContract(transactionId:string): Promise<{message:string}> 
    submitContractForApproval(freelancerId:string,contractId:string): Promise<{message:string}>
    releasePayment(contractId:string,paymentIntentId:string,transactionId:string): Promise<{message:string}>
    submitReviewAndRating(userId:string,freelacerId:string,reviewData:{ rating: number; review: string },contractId:string): Promise<{message:string}> 
    getNotifications(userId:string): Promise<{notifications:INotification[]}> 
    markNotificationAsRead(id:string): Promise<{message:string}>
    markAllNotificationsAsRead(ids:string[]): Promise<{message:string}>
    // getUserContracts(userId:string, page: number, limit: number, search: string, status: string, time: string): Promise<{contracts:IContract[]}>
    getUserContracts(userId:string, page: number, limit: number, search: string,status: string,time: string): Promise<PaginatedResponse<IContract>>

}