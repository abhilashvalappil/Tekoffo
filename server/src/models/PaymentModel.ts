import mongoose,{Schema,Types} from "mongoose";
import { IPayment } from "../interfaces";

const PaymentSchema: Schema<IPayment> = new Schema({
    stripePaymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    clientSecret:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: ['authorized','released','failed','inEscrow'],
        default: 'inEscrow'
    },
    transactionId:{
        type: String,
        required: true,
        unique: true 
    },
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
    commission:{
        type:Number,
        required: true
    },
    application_fee_amount: {
         type: Number, 
         required: true
    }, 
    transferDataDestination:{
        type: String,
        required: true
    },
    transferGroup:{
        type: String,
        required: true
    },
    onBehalfOf:{
        type: String,
        required: true
    },
    metadata: {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
          required: true,
        },
        freelancerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        clientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    chargeId: {
        type: String
    },
}, {
    timestamps: true,
  }
)

export default mongoose.model<IPayment>('Payment', PaymentSchema);