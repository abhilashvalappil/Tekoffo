import mongoose, {Document,Types} from "mongoose";

export interface IReview extends Document {
    reviewerId: Types.ObjectId;
    reviewedUserId: Types.ObjectId;
    rating: number;
    reviewText?: string;
    contractId: Types.ObjectId;
    jobId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateReviewDTO {
    reviewerId: Types.ObjectId;
    reviewedUserId: Types.ObjectId;
    rating: number;
    reviewText?: string;
    contractId: Types.ObjectId;
    jobId: Types.ObjectId;
}