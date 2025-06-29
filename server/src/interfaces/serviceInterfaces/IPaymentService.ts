import { PaginatedResponse } from "../../types/commonTypes";
import { IContract } from "../entities/IContract";
import { INotification } from "../entities/INotification";
import { IPopulatedReview, IReview } from "../entities/IReview";
import { ITransaction } from "../entities/ITransaction";
import { IWallet } from "../entities/IWallet";



export interface IPaymentService {
    checkStripeAccount(freelancerId:string): Promise<boolean>
    createStripeAccount(freelancerId:string, email:string): Promise<{onboardingLink:string}> 
    createPaymentIntent(amount: number,serviceFee:number, freelancerId: string, clientId: string, jobId: string,  proposalId: string): Promise<{ clientSecret: string; transactionId: string }>
    createContract(transactionId:string): Promise<{message:string}> 
    submitContractForApproval(freelancerId:string,contractId:string): Promise<{message:string}>
    releasePayment(userId: string,contractId:string,paymentIntentId:string,transactionId:string): Promise<{message:string}>
    submitReviewAndRating(userId:string,freelacerId:string,reviewData:{ rating: number; review: string },contractId:string): Promise<{message:string}> 
    getSubmittedReviews(userId: string): Promise<{reviews:IReview[] | null}>
    getReviews(userId: string): Promise<{reviews:IPopulatedReview[] | null}>
    getNotifications(userId:string): Promise<{notifications:INotification[]}> 
    markNotificationAsRead(userId: string,id:string): Promise<{message:string}>
    markAllNotificationsAsRead(userId: string): Promise<{message:string}>
    // getUserContracts(userId:string, page: number, limit: number, search: string, status: string, time: string): Promise<{contracts:IContract[]}>
    getUserContracts(userId:string, page: number, limit: number, search?: string, status?: string): Promise<PaginatedResponse<IContract>>
    getActiveAndCompletedContracts(userId:string): Promise<{activeContracts:number,completedContracts:number}>
    getFreelancerWallet(userId:string): Promise<IWallet|null>
    withdrawEarnings(userId:string,amount:number): Promise<boolean>
    getWalletTransactions(userId:string, page: number, limit: number): Promise<PaginatedResponse<ITransaction>>
}