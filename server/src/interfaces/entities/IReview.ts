import {Document,Types} from "mongoose";

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



export interface PopulatedReviewer {
  _id: Types.ObjectId;
  fullName: string;
  profilePicture: string;
  country: string;   
}

export interface PopulatedJob {
  _id: Types.ObjectId;
  title: string;
}

// export interface IPopulatedReview {
//   _id: Types.ObjectId;
//   reviewerId: PopulatedReviewer;
//   reviewedUserId: string;
//   rating: number;
//   reviewText: string;
//   contractId: Types.ObjectId;
//   jobId: PopulatedJob;
//   createdAt: Date;
//   updatedAt: Date;
// }

//*** */

export interface ReviewerDetails {
  _id: Types.ObjectId;
  fullName: string;
  profilePicture?: string;
  country?: string;
}

export interface ProjectDetails {
  _id: Types.ObjectId;
  title: string;
}

export interface IPopulatedReview {
  _id: Types.ObjectId;
  reviewText: string;
  rating: number;
  createdAt: Date;
  reviewerDetails: ReviewerDetails;
  projectDetails: ProjectDetails;
}