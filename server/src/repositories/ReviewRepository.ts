import Review from '../models/ReviewModel';
import {  IReview, CreateReviewDTO, IReviewRepository, IPopulatedReview } from '../interfaces';
import BaseRepository from './BaseRepository';
import { PipelineStage, Types } from 'mongoose';


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

    // async findReviewsByUserId(userId: string, search?: string, filter?: string): Promise<IPopulatedReview[] | null> {
    //     return await Review.find({
    //         reviewedUserId: new Types.ObjectId(userId),
    //     })
    //     .populate('reviewerId', 'fullName profilePicture country')
    //     .populate('jobId', 'title')
    //     .sort({ createdAt: -1 })
    //     .lean<IPopulatedReview[]>();
    // }

    async findReviewsByUserId(userId: string, search?: string, filter?: string): Promise<IPopulatedReview[] | null> {
        const pipeline: PipelineStage[] = [
    {
      $match: {
        reviewedUserId: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviewerId",
        foreignField: "_id",
        as: "reviewerDetails",
      },
    },
    { $unwind: "$reviewerDetails" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "projectDetails",
      },
    },
    { $unwind: "$projectDetails" },
  ];

  // 🔎 Search on job title or reviewer name
  if (search) {
    const regex = new RegExp(search, "i");
    pipeline.push({
      $match: {
        $or: [
          { "projectDetails.title": { $regex: regex } },
          { "reviewerDetails.fullName": { $regex: regex } }, // adjust field (username/fullName) as per schema
        ],
      },
    });
  }

  // 🎯 Filter by rating (or extend for other filters)
  if (filter && filter !== "all") {
    const rating = parseInt(filter, 10);
    if (!isNaN(rating)) {
      pipeline.push({
        $match: { rating },
      });
    }
  }

  // 🎨 Shape the final output
  pipeline.push({
    $project: {
      _id: 1,
      reviewText: 1,
      rating: 1,
      createdAt: 1,
      "reviewerDetails._id": 1,
      "reviewerDetails.fullName": 1,
      "reviewerDetails.profilePicture": 1,
      "reviewerDetails.country": 1,
      "projectDetails._id": 1,
      "projectDetails.title": 1,
    },
  });

  // ⏱ Sort latest first
  pipeline.push({
    $sort: { createdAt: -1 },
  });

  const reviews = await Review.aggregate(pipeline);
  return reviews as IPopulatedReview[];
    }

    async getReviewStats(userId: string): Promise<{ totalReviews: number; avgRating: number; fiveStarReviews: number }> {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        reviewedUserId: new Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        fiveStarReviews: {
          $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
        },
      },
    },
  ];

  const result = await Review.aggregate(pipeline);

  return (
    result[0] || {
      totalReviews: 0,
      avgRating: 0,
      fiveStarReviews: 0,
    }
  );
}




}


export default new ReviewRepository();