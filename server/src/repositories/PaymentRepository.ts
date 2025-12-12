import dotenv from 'dotenv';
dotenv.config();
import Payment from '../models/PaymentModel'
import BaseRepository from "./BaseRepository";
import { IPayment,IPaymentRepository } from "../interfaces";
import Stripe from "stripe";
import { TransactionResult } from '../types/payment';
import mongoose, { PipelineStage } from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
 
 
export type PaymentStatus = 'released' | 'authorized' | 'failed' | 'inEscrow';
 

class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
    constructor(){
        super(Payment)
    }

   async createConnectedAccount(freelancerId:string,email:string): Promise<{accountId:string}> {
    console.log('console from PaymentRepository createstripe :',freelancerId,email)
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
    throw new Error('Failed to create connected account');
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

    async findUserTransactions(clientId: string,skip: number,limit: number,search?: string): Promise<TransactionResult[]> {
        const pipeline: PipelineStage[] = [
            {
            $match: {
                clientId: new mongoose.Types.ObjectId(clientId),
            },
            },
            {
            $lookup: {
                from: "users",
                localField: "freelancerId",
                foreignField: "_id",
                as: "freelancer",
            },
            },
            {
            $lookup: {
                from: "jobs",
                localField: "jobId",
                foreignField: "_id",
                as: "job",
            },
            },
            { $unwind: { path: "$freelancer", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },

            ...(search
            ? [
                {
                    $match: {
                    $or: [
                        { "job.title": { $regex: search, $options: "i" } },
                        { "freelancer.fullName": { $regex: search, $options: "i" } },
                        { status: { $regex: search, $options: "i" } },
                    ],
                    },
                },
                ]
            : []),

            {
            $project: {
                _id: 0,
                transactionId: 1,
                amount: 1,
                status: 1,
                freelancerName: "$freelancer.fullName",
                jobTitle: "$job.title",
                createdAt: 1,
            },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];

        return await Payment.aggregate<TransactionResult>(pipeline);
    }



    async countUserTransactions(clientId: string, search?: string): Promise<number> {
        const pipeline: PipelineStage[] = [
            {
            $match: {
                clientId: new mongoose.Types.ObjectId(clientId),
            },
            },
            {
            $lookup: {
                from: "users",
                localField: "freelancerId",
                foreignField: "_id",
                as: "freelancer",
            },
            },
            {
            $lookup: {
                from: "jobs",
                localField: "jobId",
                foreignField: "_id",
                as: "job",
            },
            },
            { $unwind: { path: "$freelancer", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },

            ...(search
            ? [
                {
                    $match: {
                    $or: [
                        { "job.title": { $regex: search, $options: "i" } },
                        { "freelancer.fullName": { $regex: search, $options: "i" } },
                        { status: { $regex: search, $options: "i" } },
                    ],
                    },
                },
                ]
            : []),

            { $count: "total" },
        ];

        const result = await Payment.aggregate(pipeline);
        return result[0]?.total || 0;
    }


    
}

export default new PaymentRepository();