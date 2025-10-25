import dotenv from 'dotenv';
dotenv.config();
import Payment from '../models/PaymentModel'
import BaseRepository from "./BaseRepository";
import { IPayment,IPaymentRepository } from "../interfaces";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
 
 
export type PaymentStatus = 'released' | 'authorized' | 'failed' | 'inEscrow';
 

class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
    constructor(){
        super(Payment)
    }

   async createConnectedAccount(freelancerId:string,email:string): Promise<{accountId:string}> {
    console.log('console from PaymentRepository createstripe :',freelancerId,email)
    try {
    const account = await stripe.accounts.create({
        type:'express',
        email: email,
        country: 'US',
        // email,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
    })
    console.log('Account created:', account.id);
    return { accountId: account.id }; 
} catch (error: any) {
    console.error('Stripe account creation failed ❌:', error.message, error);
    throw new Error('Failed to create connected account');
}
   }

   async createAccountLink(accountId:string): Promise<{onboardingLink:string}> {
    const onboardingLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.CLIENT_URL}/onboarding/refresh`,
        return_url: `${process.env.CLIENT_URL}/onboarding/success`,
        type: 'account_onboarding',
      });
      return { onboardingLink: onboardingLink.url };
   }
    
   async createPayment(paymentDetails: any): Promise<IPayment> {
    return await this.create(paymentDetails);
    }

    async findTransaction(transactionId:string): Promise<IPayment | null>{
        return await this.findOne({ transactionId });
    }

    async updatePaymentStatus(transactionId:string, status: PaymentStatus): Promise<IPayment | null>{
        return await this.findOneAndUpdate({ _id: transactionId },{status })
    }
    
}

export default new PaymentRepository();