import { IPopulatedReview, IReview } from "../entities/IReview";

export interface IReviewService {
    submitReviewAndRating(userId:string,freelacerId:string,reviewData:{ rating: number; review: string },contractId:string): Promise<{message:string}>
    getSubmittedReviews(userId: string): Promise<{reviews:IReview[] | null}>
    getReviews(userId: string, search?: string, filter?: string): Promise<{reviews:IPopulatedReview[] | null}>
    getReviewStats(userId: string): Promise<{ totalReviews: number; avgRating: number; fiveStarReviews: number }>

}