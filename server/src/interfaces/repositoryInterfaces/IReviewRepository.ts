import { CreateReviewDTO, IPopulatedReview, IReview } from "../entities/IReview";

   

export interface IReviewRepository {
    createReviewAndRating(review:CreateReviewDTO): Promise<IReview>
    findReviewsByReviewerId(userId:string): Promise<IReview[] | null>
    findReviewsByUserId(userId:string, search?:string, filter?:string): Promise<IPopulatedReview[] | null>
    getReviewStats(userId: string): Promise<{ totalReviews: number; avgRating: number; fiveStarReviews: number }>
}











 