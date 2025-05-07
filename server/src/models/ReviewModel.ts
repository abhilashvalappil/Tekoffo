import mongoose, { Schema, Types } from 'mongoose';
import { IReview } from "../interfaces";

const ReviewSchema : Schema<IReview> = new Schema({
    reviewerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedUserId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewText: {
        type: String,
        trim: true,
    },
    contractId:{
        type: Schema.Types.ObjectId,
        ref:'Contract',
        required:true
    },
    jobId:{
        type: Schema.Types.ObjectId,
        ref:'Job',
        required:true
    }
},{ 
    timestamps: true 
 }
)

export default mongoose.model<IReview>('Review', ReviewSchema);