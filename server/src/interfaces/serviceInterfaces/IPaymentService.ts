import { PaginatedResponse } from "../../types/commonTypes";
import { TransactionResult } from "../../types/payment";
import { IContract } from "../entities/IContract";

export interface IPaymentService {
    getStripeAccount(freelancerId:string): Promise<boolean>
    createStripeAccount(freelancerId:string, email:string): Promise<{onboardingLink:string}> 
    createPaymentIntent(amount: number,serviceFee:number, freelancerId: string, clientId: string, jobId: string,  proposalId: string): Promise<{ clientSecret: string; transactionId: string }>
    createContract(transactionId:string): Promise<{message:string}> 
    submitContract(freelancerId:string,contractId:string): Promise<{message:string}>
    releasePayment(userId: string,contractId:string,paymentIntentId:string,transactionId:string): Promise<{message:string}>
    getContractsByUser(userId:string, page: number, limit: number, search?: string, status?: string): Promise<PaginatedResponse<IContract>>
    getActiveAndCompletedContracts(userId:string): Promise<{activeContracts:number,completedContracts:number}>
    getPayments(userId: string, page: number, limit: number, search?: string): Promise<PaginatedResponse<TransactionResult>>
}