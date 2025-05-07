import { CreateReviewDTO, IReview } from "../entities/IReview";

   

export interface IReviewRepository {
    createReviewAndRating(review:CreateReviewDTO): Promise<IReview>
}











 