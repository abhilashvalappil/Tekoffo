import mongoose, { Schema, Types } from 'mongoose';
import { IContract, status } from "../interfaces";

const ContractSchema : Schema<IContract>  = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required:true
    },
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
    },
    stripePaymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    application_fee_amount: {
        type: Number, 
        required: true
   }, 
    platFormServiceFee:{
        type: Number, 
        required: true
    },
    transferDataDestination:{
        type: String,
        required: true
    },
    transactionId:{
        type: String,
        required: true
    },
    contractStatus: {
        type: String,
        enum: ['active', 'submitted', 'completed', 'cancelled'],
        default: status.Active,
      },
      startedAt:{
        type: Date,
        required: true
     },
     completedAt:{
        type: Date
     }
}, {
    timestamps: true,
  }
)

export default mongoose.model<IContract>('Contract', ContractSchema);