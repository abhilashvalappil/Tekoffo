
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

export interface IFrontendPopulatedReview {
  _id: string;  
  reviewerId: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  reviewedUserId: string;
  rating: number;
  reviewText: string;
  contractId: string;
  jobId: string;
  createdAt: string;  
  updatedAt: string;
  helpful?: number;
}
