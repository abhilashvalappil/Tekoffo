import { CreateReviewDTO, IPopulatedReview, IReview } from "../entities/IReview";

   

export interface IReviewRepository {
    createReviewAndRating(review:CreateReviewDTO): Promise<IReview>
    findReviewsByReviewerId(userId:string): Promise<IReview[] | null>
    findReviewsByUserId(userId: string): Promise<IPopulatedReview[] | null>
}











 