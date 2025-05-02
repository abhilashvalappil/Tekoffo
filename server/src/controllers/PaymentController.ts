import { Request, Response, NextFunction } from "express";
import { IPaymentService } from "../interfaces"; 
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();


interface AuthRequest extends Request {
    userId?: string;  
  }

export class PaymentController {
    private paymentService: IPaymentService;
    private stripe: Stripe;

    constructor(paymentService: IPaymentService){
        this.paymentService = paymentService;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
    }

     async checkStripeAccount(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
            console.log('console from checkstripeacoount controller',freelancerId)
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }   
            const hasStripeAccount = await this.paymentService.checkStripeAccount(freelancerId);
            res.json({ hasStripeAccount });
        } catch (error) {
            next(error)
        }
    }

     async createConnectedAccount(req:AuthRequest, res:Response, next:NextFunction): Promise<void> {
        try {
            const freelancerId = req.userId;
            if(!freelancerId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            
            const {   email } = req.query as { email: string };
            console.log('console from createconnectaccount',email)
            // const { id, email } = req.body;
            const onboardingLink = await this.paymentService.createStripeAccount(freelancerId,email)
            console.log('console from connectacccount controler5555555555',onboardingLink)
            res.json({ url: onboardingLink });
        } catch (error) {
            console.error('Error in createConnectedAccount:', error);  
            next(error)
        }
    }
    
     async createPaymentIntend(req: AuthRequest, res: Response, next: NextFunction): Promise<void>{
        try {

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            console.log('console from userconrtoler createpayment :', req.body.paymentIntentData)
            const { amount, freelancerId, clientId, jobId,proposalId } = req.body.paymentIntentData;
            const { clientSecret, transactionId } = await this.paymentService.createPaymentIntent(amount, freelancerId, clientId, jobId,proposalId );
            res.json({ clientSecret, transactionId });
        } catch (error) {
            next(error)
        }
    }

    async createContract(req: AuthRequest, res: Response, next: NextFunction): Promise<void>{
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            console.log('console from createcontracttttt',req.body)
            const {transactionId} = req.body;
            await this.paymentService.createContract(transactionId)
        } catch (error) {
            next(error)
        }
    }

    async releasePayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>{
        try {

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            console.log('releasepayment 4444444444444444oooofffffffffff',req.body)
            const {paymentIntentId,transactionId} = req.body;

            const {message} = await this.paymentService.releasePayment(paymentIntentId,transactionId)
            console.log('console from releasepayment controller7777 :',message)
            res.status(Http_Status.OK).json(message)
        } catch (error) {
            next(error)
        }
    }

    async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {notifications} = await this.paymentService.getNotifications(userId)
            // console.log('console from notifications controller 555555',notifications)
            res.status(Http_Status.OK).json(notifications)
        } catch (error) {
            next(error)
        }
    }
     
    async markNotificationAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const { id } = req.params;
            await this.paymentService.markNotificationAsRead(id)
        } catch (error) {
            next(error)
        }
    }
    async markAllNotificationsAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const { ids } = req.body;
            await this.paymentService.markAllNotificationsAsRead(ids)
        } catch (error) {
            next(error)
        }
    }


}