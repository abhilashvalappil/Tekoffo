import { Request, Response, NextFunction } from "express";
import { IPaymentService } from "../interfaces";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
}

export class PaymentController {private paymentService: IPaymentService; private stripe: Stripe;

  constructor(paymentService: IPaymentService) {
    this.paymentService = paymentService;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: "2025-03-31.basil",});}

  async checkStripeAccount(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const freelancerId = req.userId;
      console.log("console from checkstripeacoount controller", freelancerId);
      if (!freelancerId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const hasStripeAccount = await this.paymentService.checkStripeAccount(freelancerId);
      res.json({ hasStripeAccount });
    } catch (error) {
      next(error);
    }
  }

  async createConnectedAccount(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const freelancerId = req.userId;
      if (!freelancerId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const { email } = req.query as { email: string };
      const onboardingLink = await this.paymentService.createStripeAccount(freelancerId,email);
      res.json({ url: onboardingLink });
    } catch (error) {
      next(error);
    }
  }

  async createPaymentIntend(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      // console.log('console from userconrtoler createpayment :', req.body.paymentIntentData)
      const { amount, serviceFee, freelancerId, clientId, jobId, proposalId } = req.body.paymentIntentData;
      const { clientSecret, transactionId } =
        await this.paymentService.createPaymentIntent(
          amount,
          serviceFee,
          freelancerId,
          clientId,
          jobId,
          proposalId
        );
      res.json({ clientSecret, transactionId });
    } catch (error) {
      next(error);
    }
  }

  async createContract(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const { transactionId } = req.body;
      await this.paymentService.createContract(transactionId);
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.FORBIDDEN).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const {notifications}  = await this.paymentService.getNotifications(userId);
      res.status(Http_Status.OK).json({notifications});
    } catch (error) {
      next(error);
    }
  }

    async markNotificationAsRead(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const { id } = req.params;
      await this.paymentService.markNotificationAsRead(userId,id);
    } catch (error) {
      next(error);
    }
  }

  async getUserContracts(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
          res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
          return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const search = req.query.search as string;
      const status = req.query.status as string;

      if (isNaN(page) || page < 1) {
        res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
      }
      if (isNaN(limit) || limit < 1) {
        res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
      }
      const paginatedResponse = await this.paymentService.getUserContracts(
        userId,
        page,
        limit,
        search,
        status
      );
      res.status(Http_Status.OK).json(paginatedResponse);
    } catch (error) {
      next(error);
    }
  }

  async getActiveAndCompletedContracts(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
          res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
          return;
      }
      const {activeContracts,completedContracts} = await this.paymentService.getActiveAndCompletedContracts(userId)
      res.status(Http_Status.OK).json({activeContracts,completedContracts})
    } catch (error) {
      next(error);
    }
  }

  async submitContractForApproval(req: AuthRequest,res: Response,next: NextFunction
  ): Promise<void> {
    try {
      const freelancerId = req.userId;
      if (!freelancerId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const { contractId } = req.body;
      const { message } = await this.paymentService.submitContractForApproval(
        freelancerId,
        contractId
      );
      res.status(Http_Status.OK).json(message);
    } catch (error) {
      next(error);
    }
  }

  async releasePayment(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const {
        contractId,
        stripePaymentIntentId: paymentIntentId,
        transactionId,
      } = req.body;
      const { message } = await this.paymentService.releasePayment(userId,contractId,paymentIntentId,transactionId);
      res.status(Http_Status.OK).json(message);
    } catch (error) {
      next(error);
    }
  }

  async submitReviewAndRating(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      // console.log('console from submit reviewwwwwwwwww',req.body)
      const { reviewedUserId, reviewData, contractId } = req.body;
      const { message } = await this.paymentService.submitReviewAndRating(
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
      const {reviews} = await this.paymentService.getSubmittedReviews(userId)
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
      const {reviews} = await this.paymentService.getReviews(userId)
      if(!reviews){
        res.status(Http_Status.NOT_FOUND).json({message:MESSAGES.REVIEWS_NOT_FOUND})
        return;
      }
      res.status(Http_Status.OK).json({reviews})
    } catch (error) {
      next(error);
    }
  }

  async markAllNotificationsAsRead(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      await this.paymentService.markAllNotificationsAsRead(userId);
    } catch (error) {
      next(error);
    }
  }

  async getFreelancerWallet(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const wallet = await this.paymentService.getFreelancerWallet(userId)
      if (!wallet) {
          res.status(Http_Status.NOT_FOUND).json({ error: MESSAGES.WALLET_NOT_FOUND });
          return;
        }
        res.status(Http_Status.OK).json({ wallet });
    } catch (error) {
      next(error);
    }
  }

  async withdrawEarnings(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }

      const { amount } = req.body;
       if (!amount || amount <= 0) {
         res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.INVALID_AMOUNT});
       }
      const success = await this.paymentService.withdrawEarnings(userId,amount)
      if (success) {
            res.status(Http_Status.OK).json({ message: MESSAGES.WITHDRAWAL_SUCCESS });
        } else {
            res.status(Http_Status.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.WITHDRAWAL_FAILED });
        }
    } catch (error) {
      next(error);
    }
  }

  async getWalletTransactions(req: AuthRequest,res: Response,next: NextFunction): Promise<void>{
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;

      if (isNaN(page) || page < 1){
        res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
      }
      if (isNaN(limit) || limit < 1){
        res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
      }

      const transactions = await this.paymentService.getWalletTransactions(userId,page,limit)
      if(!transactions){
        res.status(Http_Status.NOT_FOUND).json({message:MESSAGES.TRANSACTION_NOT_FOUND})
      }
      res.status(Http_Status.OK).json({transactions})
    } catch (error) {
      next(error);
    }
  }

}
