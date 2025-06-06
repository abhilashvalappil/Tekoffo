import mongoose, { Document,Types } from "mongoose";


export interface IContract extends Document {
    clientId:mongoose.Schema.Types.ObjectId;
    freelancerId:mongoose.Schema.Types.ObjectId;
    proposalId:mongoose.Schema.Types.ObjectId;
    jobId:mongoose.Schema.Types.ObjectId;
    gigId?:mongoose.Schema.Types.ObjectId;
    stripePaymentIntentId:string;
    amount:number;
    application_fee_amount: number;
    platFormServiceFee: number;
    transferDataDestination: string;
    transactionId:string;
    contractStatus:status;
    startedAt:Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum status{
    Active = 'active',
    Submitted = 'submitted',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

export interface CreateContractDTO {
    clientId: mongoose.Schema.Types.ObjectId;
    freelancerId: mongoose.Schema.Types.ObjectId;
    jobId: mongoose.Schema.Types.ObjectId;
    proposalId: mongoose.Schema.Types.ObjectId;
    transactionId: string;
    stripePaymentIntentId: string;
    amount:number
    application_fee_amount: number;
    platFormServiceFee: number;
    transferDataDestination: string;
    contractStatus: status;
    startedAt: Date;
  }
  
  export interface IContractResponse {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  jobId: Types.ObjectId | {
    _id: Types.ObjectId;
    title: string;
  };
  freelancerId: Types.ObjectId | {
    _id: Types.ObjectId;
    fullName: string;
  };
  contractStatus: status;
  createdAt: Date;
  updatedAt: Date;
}