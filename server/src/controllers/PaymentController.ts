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

  async getStripeAccount(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const freelancerId = req.userId;
      if (!freelancerId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const hasStripeAccount = await this.paymentService.getStripeAccount(freelancerId);
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

  async getContractsByUser(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
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
      const paginatedResponse = await this.paymentService.getContractsByUser(
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

  async submitContract(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
      const freelancerId = req.userId;
      if (!freelancerId) {
        res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
        return;
      }
      const contractId = req.params.id;
      const { message } = await this.paymentService.submitContract(
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
 
}
