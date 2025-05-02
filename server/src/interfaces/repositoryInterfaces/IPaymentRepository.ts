import { IPayment } from "../entities/IPayment"
export type PaymentStatus = 'released' | 'authorized' | 'failed' | 'inEscrow';

export interface IPaymentRepository {
    createConnectedAccount(freelancerId:string,email:string): Promise<{accountId:string}>
    createAccountLink(accountId:string): Promise<{onboardingLink:string}>
    createPayment(paymentDetails: any): Promise<IPayment> 
    findTransaction(transactionId:string): Promise<IPayment | null>
    updatePaymentStatus(transactionId:string, status: PaymentStatus): Promise<IPayment | null>
}