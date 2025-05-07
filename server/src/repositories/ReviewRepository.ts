import Review from '../models/ReviewModel';
import {  IReview, CreateReviewDTO, IReviewRepository } from '../interfaces';
import BaseRepository from './BaseRepository';


class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor(){
        super(Review)
    }

    async createReviewAndRating(review:CreateReviewDTO): Promise<IReview> {
        return await this.create(review)
    }

}


export default new ReviewRepository();