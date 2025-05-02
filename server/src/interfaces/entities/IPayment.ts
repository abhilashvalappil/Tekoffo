import mongoose, { Document,Types } from "mongoose";

export interface IPayment extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    clientId:mongoose.Schema.Types.ObjectId;
    freelancerId:mongoose.Schema.Types.ObjectId;
    proposalId:mongoose.Schema.Types.ObjectId;
    jobId:mongoose.Schema.Types.ObjectId;
    amount:number;
    currency:string;
    status:'authorized' | 'released' | 'failed' | 'inEscrow';
    stripePaymentIntentId: string;
    transactionId: string;
    clientSecret: string;
    application_fee_amount: number;
    platFormServiceFee: number;
    transferDataDestination: string;
    transferGroup: string;
    onBehalfOf: string;
    metadata: { type: Object, required: true },
    chargeId: string;
    createdAt?: Date;
    updatedAt?: Date;
}