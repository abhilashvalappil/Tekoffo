 
import Stripe from "stripe";
import { IUserRepository,IJobRepository,IProposalRepository, IPaymentService, CreateContractDTO, INotification, IContract, status, CreateReviewDTO, IWallet, ITransaction, IReview, IPopulatedReview  } from "../interfaces";
import {MESSAGES} from '../constants/messages'
import { NotFoundError, UnauthorizedError, ValidationError } from "../errors/customErrors";
import mongoose, { Types } from "mongoose";
import { IPaymentRepository,IContractRepository,INotificationRepository,IReviewRepository,IWalletRepository,ITransactionRepository, IPlatformRepository } from "../interfaces"; 
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
import { getIO } from '../config/socket';
import { PaginatedResponse } from "../types/commonTypes";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
export const TRANSACTION_TYPE = {
  CREDIT: 'credit',
  DEBIT: 'debit'
} as const;


export class PaymentService implements IPaymentService {
  private userRepository: IUserRepository;
  private jobRepository: IJobRepository;
  private proposalRepository: IProposalRepository;
  private paymentRepository: IPaymentRepository;
  private contractRepository: IContractRepository;
  private notificationRepository: INotificationRepository;
  private reviewRepository: IReviewRepository;
  private walletRepository: IWalletRepository;
  private transactionRepository: ITransactionRepository;
  private platformRepository: IPlatformRepository;
  private stripe: Stripe;

  constructor(
    userRepository: IUserRepository,
    jobRepository: IJobRepository,
    proposalRepository: IProposalRepository,
    paymentRepository: IPaymentRepository,
    contractRepository: IContractRepository,
    notificationRepository: INotificationRepository,
    reviewRepository: IReviewRepository,
    walletRepository: IWalletRepository,
    transactionRepository: ITransactionRepository,
    platformRepository: IPlatformRepository
  ) {
    this.userRepository = userRepository;
    this.jobRepository = jobRepository;
    this.proposalRepository = proposalRepository;
    this.paymentRepository = paymentRepository;
    this.contractRepository = contractRepository;
    this.notificationRepository = notificationRepository;
    this.reviewRepository = reviewRepository;
    this.walletRepository = walletRepository;
    this.transactionRepository = transactionRepository;
    this.platformRepository = platformRepository;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-03-31.basil",
    });
  }

  async checkStripeAccount(freelancerId: string): Promise<boolean> {
    const freelancerExist = await this.userRepository.findUserById(
      freelancerId
    );
    if (!freelancerExist) {
      throw new NotFoundError(MESSAGES.INVALID_USER);
    }
    return await this.userRepository.checkStripeAccount(freelancerId);
  }

  async createStripeAccount(freelancerId: string,email: string): Promise<{ onboardingLink: string }> {
    const freelancerExist = await this.userRepository.findUserById(freelancerId);
    if (!freelancerExist) {
      throw new NotFoundError(MESSAGES.INVALID_USER);
    }
    const { accountId } = await this.paymentRepository.createConnectedAccount(freelancerId,email);
    await this.userRepository.findByEmailAndUpdate(email, {
      stripeAccountId: accountId,
    });
    const { onboardingLink } = await this.paymentRepository.createAccountLink(
      accountId
    );
    return { onboardingLink };
  }

  async createPaymentIntent(amount: number,serviceFee: number,freelancerId: string,clientId: string,jobId: string,proposalId: string): Promise<{ clientSecret: string; transactionId: string }> {
    const client = await this.userRepository.findUserById(clientId);
    if (!client?.fullName || !client?.email || !client?._id) {
      throw new Error(
        "Client data is incomplete. Cannot create Stripe customer."
      );
    }
    const customer = await stripe.customers.create({
      name: client.fullName,
      email: client.email,
      metadata: {
        clientId: clientId,
      },
    });
    const freelancer = await this.userRepository.findUserById(freelancerId);
    if (!freelancer?.stripeAccountId) {
      throw new Error("Freelancer Stripe account ID not found.");
    }
    // console.log('checking amountttttttttt :', amount)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      // amount: amount * 100,
      currency: "usd",
      capture_method: "manual",
      payment_method_types: ["card"],
      customer: customer.id,
      application_fee_amount: Math.round(amount * 0.05),
      // application_fee_amount:  Math.round(amount * 100 * 0.10),
      transfer_data: {
        destination: freelancer?.stripeAccountId,
      },
      transfer_group: `job_${jobId}`,
      on_behalf_of: freelancer?.stripeAccountId,
      metadata: {
        jobId,
        freelancerId,
        clientId,
      },
    });
    console.log("console from createpayment userserviceee", paymentIntent);

    const transactionId = uuidv4();
    const transferDataDestination =
      paymentIntent.transfer_data?.destination ?? null;
    const paymentDetails = {
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: "usd",
      transactionId,
      clientId,
      freelancerId,
      proposalId,
      jobId,
      application_fee_amount: amount * 0.05,
      platFormServiceFee: amount * 0.05,
      clientSecret: paymentIntent.client_secret,
      transferDataDestination,
      transferGroup: paymentIntent.transfer_group,
      onBehalfOf: freelancer.stripeAccountId,
      metadata: {
        jobId,
        freelancerId,
        clientId,
      },
    };

    const payment = await this.paymentRepository.createPayment(paymentDetails);
    if (paymentIntent.client_secret === null) {
      throw new Error("Payment intent creation failed, client_secret is null.");
    }
    const totalSpent = amount + paymentDetails.platFormServiceFee;
    await this.userRepository.updateUserProfile(clientId,{total_Spent:totalSpent})
    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: payment.transactionId,
    };
  }

  async createContract(transferId: string): Promise<{ message: string }> {
    const payment = await this.paymentRepository.findTransaction(transferId);
    if (!payment) {
      throw new NotFoundError(MESSAGES.TRANSACTION_NOT_FOUND);
    }
    const {
      clientId,
      freelancerId,
      proposalId,
      jobId,
      stripePaymentIntentId,
      amount,
      application_fee_amount,
      platFormServiceFee,
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
      application_fee_amount,
      platFormServiceFee,
      transferDataDestination,
      transactionId,
      contractStatus: status.Active,
      startedAt: new Date(),
    };
    await this.contractRepository.createContract(newContract);
    await this.jobRepository.updateJobPost(jobId.toString(), {
      status: "inprogress",
    });

    const platformFee = payment.amount * 0.05;
    const pendingEarning = payment.amount - platformFee;
    await this.walletRepository.updateWalletPendingEarnings(
      freelancerId.toString(),
      pendingEarning
    );

    const client = await this.userRepository.findUserById(clientId.toString());
    if (!client) {
      throw new NotFoundError(MESSAGES.INVALID_USER);
    }
    const message = `Your payment of $${amount} has been authorized.
        The client ${client.fullName} has confirmed the payment. You can now start the work`;

    const notification = {
      clientId,
      freelancerId,
      message,
    };

    const createdNotification =
      await this.notificationRepository.createNotification(notification);
    const io = getIO();
    io.to(freelancerId.toString()).emit("notification", {
      id: createdNotification._id.toString(),
      message,
    });
    console.log("Notification sent to freelancer", message);
    return { message: MESSAGES.CONTRACT_CREATED };
  }

  async getNotifications(userId: string): Promise<{ notifications: INotification[] }> {
    const user  = await this.userRepository.findUserById(userId);
     if(!user){
      throw new NotFoundError(MESSAGES.UNAUTHORIZED);
    }
    const notifications = await this.notificationRepository.findNotifications(
      userId
    );
    return { notifications };
  }

  async markNotificationAsRead(id: string): Promise<{ message: string }> {
     
      await this.notificationRepository.findNotificationById(id);
    await this.notificationRepository.updateNotification(id);
    return { message: "Notification marked as read" };
  }

  async markAllNotificationsAsRead(ids: string[]): Promise<{ message: string }> {
    await this.notificationRepository.updateAllNotifications(ids);
    return { message: "All Notifications are marked as read" };
  }

  async getUserContracts(userId: string,page: number,limit: number,search?: string,  status?: string): Promise<PaginatedResponse<IContract>> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.UNAUTHORIZED);
    }
    const skip = (page - 1) * limit;
    let contracts: IContract[] = [];
    let total = 0;

    if (user.role == "freelancer") {
      [contracts, total] = await Promise.all([
        this.contractRepository.findContractsByFreelancerId(
          userId,
          skip,
          limit,
          search,
          status
        ),
        this.contractRepository.countContractsByFreelancerId(userId),
      ]);
    }
    if (user.role == "client") {
      [contracts, total] = await Promise.all([
        this.contractRepository.findContractsByClientId(
          userId,
          skip,
          limit,
          search,
          status
        ),
        this.contractRepository.countContractsByClientId(userId),
      ]);
    }
    return {
      data: contracts,
      meta: { total, page, pages: Math.ceil(total / limit), limit },
    };
  }

  async getActiveAndCompletedContracts(userId:string): Promise<{activeContracts:number,completedContracts:number}> {
    const user = await this.userRepository.findUserById(userId)
    if(!user){
      throw new NotFoundError(MESSAGES.UNAUTHORIZED);
    }
    const [activeContracts,completedContracts] = await Promise.all([
      this.contractRepository.countActiveContractsByFreelancerId(userId),
      this.contractRepository.countCompletedContractsByFreelancerId(userId)
    ])
    return{activeContracts,completedContracts}
  }

  async submitContractForApproval(freelancerId: string,contractId: string): Promise<{ message: string }> {
    const contractExist = await this.contractRepository.findContractById(contractId);
    if (!contractExist) {
      throw new NotFoundError(MESSAGES.CONTRACT_NOT_FOUND);
    }
    const freelancerExist = await this.userRepository.findUserById(
      freelancerId
    );
    if (!freelancerExist) {
      throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
    }
    await this.contractRepository.updateContractStatus(
      contractId,
      status.Submitted
    );
    return { message: MESSAGES.CONTRACT_SUBMITTED_FOR_APPROVAL };
  }

  async releasePayment(contractId: string,paymentIntentId: string,transactionId: string): Promise<{ message: string }> {
    
    const contractExist = await this.contractRepository.findContractById(
      contractId
    );
    if (!contractExist) {
      throw new NotFoundError(MESSAGES.CONTRACT_NOT_FOUND);
    }
    const transaction = await this.paymentRepository.findTransaction(
      transactionId
    );
    if (!transaction) {
      throw new NotFoundError(MESSAGES.TRANSACTION_NOT_FOUND);
    }
    await stripe.paymentIntents.capture(paymentIntentId);

    const freelancerId = transaction.freelancerId.toString();
    const job = await this.jobRepository.findJobById(
      transaction.jobId.toString()
    );
    if (!job) {
      throw new NotFoundError(MESSAGES.JOB_NOT_FOUND);
    }
    const wallet = await this.walletRepository.findWallet(freelancerId);
    if (!wallet) {
      await this.walletRepository.createWallet(freelancerId);
    }

    const platformFee = transaction.amount * 0.05;
    const freelancerEarning = transaction.amount - platformFee;

    await this.walletRepository.updateWallet(freelancerId, freelancerEarning);

    const jobId = transaction.jobId.toString();
    const clientId = transaction.clientId.toString();
    const platformEarningsData = {
        jobId: new Types.ObjectId(jobId),
        clientId:new Types.ObjectId(clientId),
        freelancerId:new Types.ObjectId(freelancerId),
        platformCommission: platformFee * 2
    }
    await this.platformRepository.recordPlatFormEarnings(platformEarningsData)
    
    const transactiondata = {
      userId: new Types.ObjectId(freelancerId),
      type: TRANSACTION_TYPE.CREDIT,
      amount: freelancerEarning,
      description: `Payment For ${job.title}`,
    };
    await this.transactionRepository.createTransaction(transactiondata);

    await this.paymentRepository.updatePaymentStatus(
      transaction._id.toString(),
      "released"
    );
    await this.contractRepository.updateContractStatus(
      contractId,
      status.Completed
    );
    await this.jobRepository.updateJobPost(contractExist.jobId.toString(), {
      status: "completed",
    });
    return { message: MESSAGES.PAYMENT_RELEASED };
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

  async getReviews(userId: string): Promise<{reviews:IPopulatedReview[] | null}> {
    const user = await this.userRepository.findUserById(userId)
    if(!user){
        throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
    }
    const reviews = await this.reviewRepository.findReviewsByUserId(userId);
    return {reviews}
  }

  async getFreelancerWallet(userId: string): Promise<IWallet | null> {
    const freelancer = await this.userRepository.findUserById(userId);
    if (!freelancer) {
      throw new UnauthorizedError(MESSAGES.FREELANCER_NOT_FOUND);
    }
    const wallet = await this.walletRepository.findWallet(userId);
    return wallet;
  }

  async withdrawEarnings(userId: string, amount: number): Promise<boolean> {
    const freelancer = await this.userRepository.findUserById(userId);
    if (!freelancer) {
      throw new UnauthorizedError(MESSAGES.FREELANCER_NOT_FOUND);
    }
    const wallet = await this.walletRepository.findWallet(userId);
    if (!wallet) {
      throw new NotFoundError(MESSAGES.WALLET_NOT_FOUND);
    }

    if (wallet.currentBalance < amount) {
      throw new ValidationError(MESSAGES.INSUFFICIENT_BALANCE);
    }
    const success = await this.walletRepository.processWithdrawal(
      userId,
      amount
    );
    const WithDrawtransactionData = {
      userId: new Types.ObjectId(userId),
      type: TRANSACTION_TYPE.DEBIT,
      amount: amount,
      description: 'Withdrawal to bank account',
    }
    await this.transactionRepository.createTransaction(WithDrawtransactionData)
    return success;
  }

  async getWalletTransactions(userId:string,page: number,limit: number): Promise<PaginatedResponse<ITransaction>>{
    const userExist = await this.userRepository.findUserById(userId);
    if(!userExist){
        throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
    }
    const skip = (page - 1) * limit;
    const [transactions,total] = await Promise.all([
      this.transactionRepository.findTransactions(userId,skip, limit),
      this.transactionRepository.countTransactionsByUserId(userId)
    ]) 
    return {
            data: transactions,
            meta: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        };
    }

}