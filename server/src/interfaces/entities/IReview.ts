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

export interface IPopulatedReview {
  _id: Types.ObjectId;
  reviewerId: {
    _id: Types.ObjectId;
    fullName: string;
    profilePicture?: string;
  }  
  reviewedUserId: Types.ObjectId;
  rating: number;
  reviewText: string;
  contractId: Types.ObjectId;
  jobId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}