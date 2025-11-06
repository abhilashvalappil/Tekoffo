
import { Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";
import { IReviewService } from "../interfaces";

interface AuthRequest extends Request {
  userId?: string;
}

export class ReviewController {
    private reviewService: IReviewService;

    constructor(reviewService: IReviewService){
        this.reviewService = reviewService;
    }

    async submitReviewAndRating(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
                return;
            }
            const { reviewedUserId, reviewData, contractId } = req.body;
            const { message } = await this.reviewService.submitReviewAndRating(
                userId,
                reviewedUserId,
                reviewData,
                contractId
            );
            res.status(Http_Status.CREATED).json(message);
            } catch (error) {
            next(error);
            }
    }

    async getSubmittedReviews(req: AuthRequest,res: Response,next: NextFunction): Promise<void>{
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
                return;
            }
            const {reviews} = await this.reviewService.getSubmittedReviews(userId)
            res.status(Http_Status.OK).json({reviews})
            } catch (error) {
            next(error);
        }
    }

    async getReviews(req: AuthRequest,res: Response,next: NextFunction): Promise<void>{
        try {
            const userId = req.query.userId;
            if(!userId || typeof userId !== 'string'){
                res.status(Http_Status.BAD_REQUEST).json({error: MESSAGES.INVALID_REQUEST})
                return; 
            }
            const search = req.query.search as string;
            const filter = req.query.filter as string;
            const {reviews} = await this.reviewService.getReviews(userId,search,filter)
            if(!reviews){
                res.status(Http_Status.NOT_FOUND).json({message:MESSAGES.REVIEWS_NOT_FOUND})
                return;
            }
            res.status(Http_Status.OK).json({reviews})
            } catch (error) {
            next(error);
            }
    }

    async getReviewStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.query.userId as string;
            if (!userId) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.INVALID_REQUEST });
            return;
            }
            const stats = await this.reviewService.getReviewStats(userId);
            res.status(Http_Status.OK).json({ stats });
            } catch (error) {
                next(error);
            }
        }

}