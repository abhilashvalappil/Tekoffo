import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { JobController } from "../controllers/JobController";
import { PaymentController } from "../controllers/PaymentController";
import { ChatController } from "../controllers/ChatController";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { JobService } from "../services/JobService";
import UserRepository from "../repositories/UserRepository";
import { JwtService } from "../utils/jwtService";
import { CookieHandlerService } from "../utils/cookieHandlerService";
import { OAuth2Client } from 'google-auth-library';
import authMiddleware from "../middlewares/authMiddleware";
import CategoryRepository from "../repositories/CategoryRepository";
import JobRepository from "../repositories/JobRepository";
import ProposalRepository from "../repositories/ProposalRepository";
import PaymentRepository from "../repositories/PaymentRepository";
import ContractRepository from "../repositories/ContractRepository";
import WalletRepository from "../repositories/WalletRepository";
import { authorizeRole } from "../middlewares/roleMiddleware";
import { upload, uploadChatMedia } from '../utils/cloudinary';
import { uploadProposal } from "../utils/cloudinary";
import { PaymentService } from "../services/PaymentService";
import { ChatService } from "../services/ChatService";
import { NotificationController } from "../controllers/NotificationController";
import { NotificationService } from "../services/NotificationService";
import { ReviewService } from "../services/ReviewService";
import { ReviewController } from "../controllers/ReviewController";
import NotificationRepository from "../repositories/NotificationRepository";
import ReviewRepository from "../repositories/ReviewRepository";
import GigRepository from "../repositories/GigRepository";
import MessageRepository from "../repositories/MessageRepository";
import ChatRepository from "../repositories/ChatRepository";
import TransactionRepository from "../repositories/TransactionRepository";
import PlatformRepository from "../repositories/PlatformRepository";
import dotenv from 'dotenv';
import { WalletService } from "../services/WalletService";
import { WalletController } from "../controllers/WalletController";
import { commonENDPOINTS, userENDPOINTS } from "../constants/endpoints";

dotenv.config();

const userRouter = Router();

const jwtService = new JwtService();
const cookieHandlerService = new CookieHandlerService();
const googleClient = new OAuth2Client(process.env.CLIENT_ID);
const authService = new AuthService(UserRepository, jwtService,googleClient,WalletRepository); 
const authController = new AuthController(authService,cookieHandlerService);
const userService = new UserService(UserRepository,CategoryRepository,JobRepository,ProposalRepository,PaymentRepository )
const userController = new UserController(userService);
const jobService = new JobService(CategoryRepository,UserRepository,JobRepository,ProposalRepository,GigRepository,ContractRepository, NotificationRepository)
const jobController = new JobController(jobService)
const paymentService = new PaymentService(UserRepository,JobRepository,PaymentRepository,ContractRepository, NotificationRepository,WalletRepository,TransactionRepository, PlatformRepository)
const paymentController = new PaymentController(paymentService)
const messageService = new ChatService(ChatRepository,MessageRepository,UserRepository)
const chatController = new ChatController(messageService)
const notificationService = new NotificationService(UserRepository,NotificationRepository)
const notificationController = new NotificationController(notificationService)
const reviewService = new ReviewService(UserRepository,ContractRepository,ReviewRepository)
const reviewController = new ReviewController(reviewService)
const walletService = new WalletService(UserRepository,WalletRepository,TransactionRepository)
const walletController = new WalletController(walletService)


//*common user routes
userRouter.post(commonENDPOINTS.SIGNUP,authController.signUp.bind(authController));
userRouter.post(commonENDPOINTS.VERIFY_OTP,authController.verifyOtp.bind(authController));
userRouter.post(commonENDPOINTS.LOGIN,authController.signIn.bind(authController))
userRouter.post(commonENDPOINTS.GOOGLE_SIGNIN,authController.googleSignIn.bind(authController))
userRouter.post(commonENDPOINTS.RESEND_OTP,authController.resendOtp.bind(authController))
userRouter.post(commonENDPOINTS.FORGOT_PASS,authController.forgotPassword.bind(authController))
userRouter.post(commonENDPOINTS.VERIFY_FORGOT_OTP,authController.verifyForgotPassOtp.bind(authController))
userRouter.post(commonENDPOINTS.RESET_PASS,authController.resetPassword.bind(authController))
userRouter.post(commonENDPOINTS.LOGOUT,authController.logout.bind(authController))
userRouter.post('/auth/refresh-token',authController.refreshAccessToken.bind(authController))
userRouter.post('/auth/check-user',authController.userExist.bind(authController))



//* freelancer routes
userRouter.post(userENDPOINTS.CREATE_FREELANCERPROFILE,upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.createFreelancerProfile.bind(userController))
userRouter.put(userENDPOINTS.UPDATE_FREELANCERPROFILE,upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.updateFreelancerProfile.bind(userController))
userRouter.get(commonENDPOINTS.PROFILE,authMiddleware,authorizeRole(['freelancer', 'client']),userController.getUserProfile.bind(userController))

userRouter.get(userENDPOINTS.GET_JOBS,authMiddleware,authorizeRole(['freelancer','admin']),jobController.getJobs.bind(jobController))
userRouter.get(userENDPOINTS.GET_JOB_DETAILS,authMiddleware,authorizeRole('freelancer'),jobController.getJob.bind(jobController))
userRouter.get('/jobs/client/:clientId',authMiddleware,authorizeRole('freelancer'),jobController.getClientProfileByJob.bind(jobController))
userRouter.post(userENDPOINTS.CREATE_PROPOSAL,uploadProposal.single('attachments'),authMiddleware,authorizeRole('freelancer'),jobController.createProposal.bind(jobController))
userRouter.get(userENDPOINTS.FREELANCER_PROPOSALS,authMiddleware,authorizeRole('freelancer'),jobController.getProposalsByFreelancer.bind(jobController))
userRouter.get(userENDPOINTS.CREATE_STRIPE_CONNECT,authMiddleware,authorizeRole('freelancer'),paymentController.createConnectedAccount.bind(paymentController))
userRouter.get('/freelancers/:freelancerId/account',authMiddleware,authorizeRole('freelancer'),paymentController.getStripeAccount.bind(paymentController))
userRouter.get(userENDPOINTS.GET_NOTIFICATIONS,authMiddleware,authorizeRole(['freelancer', 'client']),notificationController.getNotifications.bind(notificationController))
userRouter.put(userENDPOINTS.MARK_AS_READ,authMiddleware,authorizeRole(['freelancer', 'client']),notificationController.markNotificationAsRead.bind(notificationController))
userRouter.put(userENDPOINTS.MARK_ALL_NOTIFICATIONS_AS_READ,authMiddleware,authorizeRole(['freelancer', 'client']),notificationController.markAllNotificationsAsRead.bind(notificationController))
userRouter.get(userENDPOINTS.GET_CONTRACTS,authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.getContractsByUser.bind(paymentController))
userRouter.post(userENDPOINTS.SUBMIT_CONTRACT,authMiddleware,authorizeRole('freelancer'),paymentController.submitContract.bind(paymentController))
userRouter.get(userENDPOINTS.GET_ACTIVE_CONTRACTS,authMiddleware,authorizeRole('freelancer'),paymentController.getActiveAndCompletedContracts.bind(paymentController))
userRouter.get(userENDPOINTS.GET_WALLET,authMiddleware,authorizeRole('freelancer'),walletController.getFreelancerWallet.bind(walletController))
userRouter.post(userENDPOINTS.WITHDRAW,authMiddleware,authorizeRole('freelancer'),walletController.createWithdrawal.bind(walletController))
userRouter.get(userENDPOINTS.GET_TRANSACTIONS,authMiddleware,authorizeRole('freelancer'),walletController.getWalletTransactions.bind(walletController))


userRouter.post('/users/:id',authMiddleware,authorizeRole('freelancer'),userController.getChatPartner.bind(userController))
userRouter.post(userENDPOINTS.CREATE_GIG,authMiddleware,authorizeRole('freelancer'),jobController.createGig.bind(jobController))
userRouter.put(userENDPOINTS.UPDATE_GIG,authMiddleware,authorizeRole('freelancer'),jobController.updateGig.bind(jobController))
userRouter.get(userENDPOINTS.GET_FREELANCER_GIGS,authMiddleware,authorizeRole('freelancer'),jobController.getMyGigs.bind(jobController))
userRouter.delete(userENDPOINTS.DELETE_GIG,authMiddleware,authorizeRole('freelancer'),jobController.deleteGig.bind(jobController))
userRouter.get(userENDPOINTS.GET_JOB_INVITATIONS,authMiddleware,authorizeRole('freelancer'),jobController.getJobInvitations.bind(jobController))
userRouter.put(userENDPOINTS.ACCEPT_INVITATION,authMiddleware,authorizeRole('freelancer'),jobController.acceptInvitaion.bind(jobController))
userRouter.put(userENDPOINTS.REJECT_INVITATION,authMiddleware,authorizeRole('freelancer'),jobController.rejectInvitaion.bind(jobController))


userRouter.post(userENDPOINTS.SEND_MESSAGE,uploadChatMedia.single('media'),authMiddleware,authorizeRole(['freelancer', 'client']),chatController.createMessage.bind(chatController))
userRouter.post(userENDPOINTS.GET_CHATID,authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getChat.bind(chatController))
userRouter.post(userENDPOINTS.CREATE_CHAT,authMiddleware,authorizeRole('freelancer'),chatController.createChat.bind(chatController))
userRouter.get(userENDPOINTS.GET_CHATS,authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getChatContacts.bind(chatController))
userRouter.get(userENDPOINTS.GET_MESSAGES,authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getMessagesByChat.bind(chatController))
userRouter.put(userENDPOINTS.MARK_MESSAGES_AS_READ,authMiddleware,authorizeRole(['freelancer', 'client']),chatController.markMessagesAsRead.bind(chatController))
userRouter.put(userENDPOINTS.DELETE_MSG,authMiddleware,authorizeRole(['freelancer', 'client']),chatController.deleteMessage.bind(chatController))
userRouter.get(userENDPOINTS.GET_UNREAD_MESSAGES,authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getUserUnreadChatsCount.bind(chatController))


//* client routes

userRouter.post(userENDPOINTS.CREATE_PROFILE,upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.createProfile.bind(userController))
userRouter.put(userENDPOINTS.UPDATE_PROFILE,upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.updateProfile.bind(userController))
userRouter.put(userENDPOINTS.CHANGE_PASSWORD,authMiddleware,userController.changePassword.bind(userController))

userRouter.get(userENDPOINTS.GET_LISTED_CATEGORIES,authMiddleware,authorizeRole(['client','freelancer']),jobController.getCategories.bind(jobController))
userRouter.post(userENDPOINTS.CREATE_JOB,authMiddleware,authorizeRole('client'),jobController.createJob.bind(jobController))
userRouter.put(userENDPOINTS.UPDATE_JOB,authMiddleware,authorizeRole('client'),jobController.updateJob.bind(jobController))
userRouter.delete(userENDPOINTS.DELETE_JOB,authMiddleware,authorizeRole('client'),jobController.deleteJob.bind(jobController))
userRouter.get(userENDPOINTS.GET_MY_JOBS,authMiddleware,authorizeRole('client'),jobController.getClientJobs.bind(jobController))
userRouter.get(userENDPOINTS.GET_ACTIVE_JOBS,authMiddleware,authorizeRole('client'),jobController.getActiveJobPosts.bind(jobController))

userRouter.get(userENDPOINTS.GET_Freelancers,authMiddleware,authorizeRole('client'),userController.getAllFreelancers.bind(userController))
userRouter.get(userENDPOINTS.CLIENT_PROPOSALS,authMiddleware,authorizeRole('client'),jobController.getProposalsByClient.bind(jobController))
userRouter.get(userENDPOINTS.GET_INVITATIONS_SENT,authMiddleware,authorizeRole('client'),jobController.getSentInvitations.bind(jobController))
userRouter.get(userENDPOINTS.GET_PROPOSAL,authMiddleware,authorizeRole('client'),jobController.getProposalById.bind(jobController))
userRouter.put('/proposals/:proposalId/status',authMiddleware,authorizeRole(['client','freelancer']),jobController.updateProposalStatus.bind(jobController))
userRouter.get(userENDPOINTS.GET_GIGS,authMiddleware,authorizeRole('client'),jobController.getFreelancersGigs.bind(jobController))
userRouter.post(userENDPOINTS.CREATE_JOB_INVITE,authMiddleware,authorizeRole('client'),jobController.createFreelancerJobInvitation.bind(jobController))
userRouter.post(userENDPOINTS.CREATE_CHECKOUT,authMiddleware,authorizeRole('client'),userController.createCheckout.bind(userController))

userRouter.post(userENDPOINTS.CREATE_PAYMENT_INTENT,authMiddleware,authorizeRole('client'),paymentController.createPaymentIntend.bind(paymentController))
userRouter.post(userENDPOINTS.CREATE_CONTRACT,authMiddleware,authorizeRole('client'),paymentController.createContract.bind(paymentController))
userRouter.post(userENDPOINTS.APPROVE_CONTRACT,authMiddleware,authorizeRole('client'),paymentController.releasePayment.bind(paymentController))
userRouter.get(userENDPOINTS.Get_PAYMENTS,authMiddleware,authorizeRole('client'),paymentController.getPayments.bind(paymentController))

userRouter.post(userENDPOINTS.CREATE_REVIEW,authMiddleware,authorizeRole(['client','freelancer']),reviewController.submitReviewAndRating.bind(reviewController))
userRouter.get(userENDPOINTS.GET_SUBMITTED_REVIEWS,authMiddleware,authorizeRole(['client','freelancer']),reviewController.getSubmittedReviews.bind(reviewController))
userRouter.get(userENDPOINTS.GET_REVIEWS,authMiddleware,authorizeRole(['client','freelancer']),reviewController.getReviews.bind(reviewController))
userRouter.get(userENDPOINTS.GET_REVIEW_STATS,authMiddleware,authorizeRole(['client','freelancer']),reviewController.getReviewStats.bind(reviewController))

 

 

export default userRouter;