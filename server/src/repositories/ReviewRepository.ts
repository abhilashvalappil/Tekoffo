import Review from '../models/ReviewModel';
import {  IReview, CreateReviewDTO, IReviewRepository, IPopulatedReview } from '../interfaces';
import BaseRepository from './BaseRepository';
import { Types } from 'mongoose';


class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor(){
        super(Review)
    }

    async createReviewAndRating(review:CreateReviewDTO): Promise<IReview> {
        return await this.create(review)
    }

    async findReviewsByReviewerId(userId:string): Promise<IReview[] | null>{
        return await this.find({reviewerId: new Types.ObjectId(userId)})
    }

    async findReviewsByUserId(userId: string): Promise<IPopulatedReview[] | null> {
        return await Review.find({
            reviewedUserId: new Types.ObjectId(userId),
        })
        .populate('reviewerId', 'fullName profilePicture')
        .sort({ createdAt: -1 })
        .lean<IPopulatedReview[]>();
    }


}


export default new ReviewRepository();