import mongoose, { Document,Types } from "mongoose";


export interface IContract extends Document {
    clientId:mongoose.Schema.Types.ObjectId;
    freelancerId:mongoose.Schema.Types.ObjectId;
    proposalId:mongoose.Schema.Types.ObjectId;
    jobId:mongoose.Schema.Types.ObjectId;
    gigId?:mongoose.Schema.Types.ObjectId;
    stripePaymentIntentId:string;
    amount:number;
    commission: number;
    transferDataDestination: string;
    transactionId:string;
    contractStatus:'active'| 'completed'| 'cancelled';
    startedAt:Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateContractDTO {
    clientId: mongoose.Schema.Types.ObjectId;
    freelancerId: mongoose.Schema.Types.ObjectId;
    jobId: mongoose.Schema.Types.ObjectId;
    proposalId: mongoose.Schema.Types.ObjectId;
    transactionId: string;
    stripePaymentIntentId: string;
    amount: number;
    commission: number;
    transferDataDestination: string;
    contractStatus: 'active'| 'completed'| 'cancelled';
    startedAt: Date;
  }
  