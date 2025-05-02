import mongoose, { Schema, Types } from 'mongoose';
import { IContract } from "../interfaces";

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
    commission: {
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
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
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