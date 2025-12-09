
export interface IReview {
  _id: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  reviewText: string;
  contractId: string;
  jobId: string;
  createdAt: string;  
  updatedAt: string; 
}

// frontend/types/review.ts

export interface Reviewer {
  _id: string;
  fullName: string;
  profilePicture: string;
  country: string;   // location
}

export interface Job {
  _id: string;
  title: string;
}

// export interface IFrontendPopulatedReview {
//   _id: string;  
//   reviewerId: Reviewer;
//   reviewedUserId: string;
//   rating: number;
//   reviewText: string;
//   contractId: string;
//   jobId: Job;
//   createdAt: string;  
//   updatedAt: string;
//   helpful?: number;
// }

//** */

export interface ReviewerDetails {
  _id: string;
  fullName: string;
  profilePicture?: string;
  country?: string;
}

export interface ProjectDetails {
  _id: string;
  title: string;
}

export interface IFrontendPopulatedReview{
  _id: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  reviewerDetails: ReviewerDetails;
  projectDetails: ProjectDetails;
  helpful?: number;
}