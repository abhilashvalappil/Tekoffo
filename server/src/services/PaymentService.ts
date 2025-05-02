import bcrypt from "bcrypt";
import { IUserService,IUserRepository,ProfileFormData,UserProfileResponse,ICategory,ICategoryRepository,IJobRepository,IProposalRepository, IUser, IPaymentService, CreateContractDTO, INotification,  } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { CustomError, NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { FreelancerData, JobDataType, JobInputData, JobUpdateData } from '../interfaces/entities/IJob';
import { proposalDataType } from "../types/jobTypes";
import { Types } from "mongoose";
import { IProposal } from "../interfaces/entities/IProposal";
import { IPaymentRepository,IContractRepository,INotificationRepository } from "../interfaces"; 
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
import { getIO } from '../config/socket';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });

export class PaymentService implements IPaymentService {
    private userRepository: IUserRepository;
    private jobRepository: IJobRepository;
    private proposalRepository:IProposalRepository;
    private paymentRepository: IPaymentRepository;
    private contractRepository:IContractRepository;
    private notificationRepository:INotificationRepository;
    private stripe: Stripe;


    constructor(userRepository: IUserRepository, jobRepository: IJobRepository, proposalRepository:IProposalRepository, paymentRepository: IPaymentRepository, contractRepository:IContractRepository, notificationRepository:INotificationRepository){
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        this.paymentRepository = paymentRepository;
        this.contractRepository = contractRepository;
        this.notificationRepository = notificationRepository;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
    }

    async checkStripeAccount(freelancerId:string): Promise<boolean> {
        const freelancerExist = await this.userRepository.findUserById(freelancerId)
        if(!freelancerExist){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        return await this.userRepository.checkStripeAccount(freelancerId)
    }

     async createStripeAccount(freelancerId:string, email:string): Promise<{onboardingLink:string}> {
        // console.log('console from userservice createstripe :',freelancerId,email)
        const freelancerExist = await this.userRepository.findUserById(freelancerId);
        // console.log('console from userservice createstripe :',freelancerExist)
        if(!freelancerExist){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const {accountId} = await this.paymentRepository.createConnectedAccount(freelancerId, email);
        await this.userRepository.findByEmailAndUpdate(email, { stripeAccountId: accountId});
        const {onboardingLink} = await this.paymentRepository.createAccountLink(accountId);
        return {onboardingLink}
    }

    async createPaymentIntent(amount: number, freelancerId: string, clientId: string, jobId: string,  proposalId: string): Promise<{ clientSecret: string; transactionId: string }> {
        console.log('consoleing clientidddddd',clientId)
        const client = await this.userRepository.findUserById(clientId);
        if (!client?.fullName || !client?.email || !client?._id) {
            throw new Error("Client data is incomplete. Cannot create Stripe customer.");
          }
        const customer = await stripe.customers.create({
            name: client?.fullName,
            email: client?.email,
            metadata: {
              clientId: clientId
            },
          });
        const freelancer = await this.userRepository.findUserById(freelancerId)
        if (!freelancer?.stripeAccountId) {
            throw new Error('Freelancer Stripe account ID not found.');
        }
        console.log('checking freelancerId :', freelancerId)
         const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'usd',
                capture_method: 'manual',
                payment_method_types: ['card'],
                customer: customer.id, 
                application_fee_amount:  Math.round(amount * 100 * 0.10),  
                transfer_data: {
                     destination: freelancer?.stripeAccountId 
                },
                transfer_group: `job_${jobId}`,
                on_behalf_of: freelancer?.stripeAccountId,
                metadata: {
                    jobId,
                    freelancerId,
                    clientId,
                  },
              });

              console.log('console from createpayment userserviceee', paymentIntent)

              const transactionId = uuidv4();
              const transferDataDestination = paymentIntent.transfer_data?.destination ?? null;
              const paymentDetails = {
                stripePaymentIntentId: paymentIntent.id,
                amount,
                currency: 'usd', 
                transactionId,
                clientId,
                freelancerId,
                proposalId,
                jobId,
                commission: amount * 0.1,
                application_fee_amount: amount * 0.1,
                clientSecret: paymentIntent.client_secret,
                transferDataDestination,
                transferGroup: paymentIntent.transfer_group,
                onBehalfOf: freelancer.stripeAccountId,
                metadata: {
                    jobId,
                    freelancerId,
                    clientId,
                },
              }

              const payment = await this.paymentRepository.createPayment(paymentDetails);
              if (paymentIntent.client_secret === null) {
                throw new Error('Payment intent creation failed, client_secret is null.');
            }
              return { clientSecret: paymentIntent.client_secret, transactionId: payment.transactionId };
    }

    async createContract(transferId:string): Promise<{message:string}> {

        const payment = await this.paymentRepository.findTransaction(transferId)

        if (!payment) {
            throw new NotFoundError('Payment not found');
          }

        const {
            clientId,
            freelancerId,
            proposalId,
            jobId,
            stripePaymentIntentId,
            amount,
            commission,
            transferDataDestination,
            transactionId,
        } = payment;

        const newContract: CreateContractDTO = {
            clientId,
            freelancerId,
            proposalId,
            jobId,
            stripePaymentIntentId,
            amount,
            commission,
            transferDataDestination,
            transactionId,
            contractStatus: 'active',
            startedAt: new Date(),
        }
        await this.contractRepository.createContract(newContract)
        const client = await this.userRepository.findUserById(clientId.toString())
        if(!client){
            throw new NotFoundError(MESSAGES.INVALID_USER)
        }
        const message = `Your payment of $${amount } has been authorized.
        The client ${client.fullName} has confirmed the payment. You can now start the work`;

        const notification = {
            clientId,
            freelancerId,
            message,
        }

        const createdNotification = await this.notificationRepository.createNotification(notification)
        const io = getIO();
        io.to(freelancerId.toString()).emit('notification',{
            id: createdNotification._id.toString(),
            message
        })

        console.log('Notification sent to freelancer', message);

        return{message:'Contract created and notification sent'}
    }

    async releasePayment(paymentIntentId:string,transactionId:string): Promise<{message:string}>{
        const transaction = await this.paymentRepository.findTransaction(transactionId)
        if (!transaction) {
            throw new NotFoundError('Transaction not found');
          }

        await stripe.paymentIntents.capture(paymentIntentId);
        await this.paymentRepository.updatePaymentStatus(transaction._id.toString() ,'released')
        return{message:"payment released successfully"}
    }

    async getNotifications(userId:string): Promise<{notifications:INotification[]}> {
        const userExist = await this.userRepository.findUserById(userId)
        const notifications = await this.notificationRepository.findNotifications(userId)
        return {notifications}
    }

    async markNotificationAsRead(id:string): Promise<{message:string}> {
        const findNotification = await this.notificationRepository.findNotificationById(id)
        await this.notificationRepository.updateNotification(id)
        return {message:'Notification marked as read'}
    }

    async markAllNotificationsAsRead(ids:string[]): Promise<{message:string}> {
        await this.notificationRepository.updateAllNotifications(ids)
        return {message:'All Notifications are marked as read'}
    }

}