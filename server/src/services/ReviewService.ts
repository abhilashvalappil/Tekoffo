import mongoose from "mongoose";
import { MESSAGES } from "../constants/messages";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { CreateReviewDTO, IContractRepository, IPopulatedReview, IReview, IReviewRepository, IReviewService, IUserRepository } from "../interfaces";

export class ReviewService implements IReviewService {
    private userRepository: IUserRepository;
    private contractRepository: IContractRepository;
    private reviewRepository: IReviewRepository;

    constructor(userRepository: IUserRepository,contractRepository: IContractRepository,reviewRepository: IReviewRepository,){
        this.userRepository = userRepository;
        this.contractRepository = contractRepository;
        this.reviewRepository = reviewRepository;
        
    }

    async submitReviewAndRating(
        userId: string,
        reviewedUserId: string,
        reviewData: { rating: number; review: string },
        contractId: string
    ): Promise<{ message: string }> {
        const reviewedUserIdExist = await this.userRepository.findUserById(
        reviewedUserId
        );
        if (!reviewedUserIdExist) {
        throw new NotFoundError(MESSAGES.INVALID_USER);
        }
        const contract = await this.contractRepository.findContractById(contractId);
        if (!contract) {
        throw new NotFoundError(MESSAGES.CONTRACT_NOT_FOUND);
        }
        const jobId = contract.jobId.toString();

        const reviewDatas: CreateReviewDTO = {
        reviewerId: new mongoose.Types.ObjectId(userId),
        reviewedUserId: new mongoose.Types.ObjectId(reviewedUserId),
        rating: reviewData.rating,
        reviewText: reviewData.review,
        contractId: new mongoose.Types.ObjectId(contractId),
        jobId: new mongoose.Types.ObjectId(jobId),
        };

        await this.reviewRepository.createReviewAndRating(reviewDatas);
        return { message: MESSAGES.REVIEW_SUBMITTED };
    }

    async getSubmittedReviews(userId: string): Promise<{reviews:IReview[] | null}> {
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const reviews = await this.reviewRepository.findReviewsByReviewerId(userId)
        return{reviews}
    }

    async getReviews(userId: string, search?: string, filter?: string): Promise<{reviews:IPopulatedReview[] | null}> {
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const reviews = await this.reviewRepository.findReviewsByUserId(userId,search,filter);
        return {reviews}
    }

    async getReviewStats(userId: string): Promise<{ totalReviews: number; avgRating: number; fiveStarReviews: number }> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
        }
        return this.reviewRepository.getReviewStats(userId);
        }

}