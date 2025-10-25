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
import NotificationRepository from "../repositories/NotificationRepository";
import ReviewRepository from "../repositories/ReviewRepository";
import GigRepository from "../repositories/GigRepository";
import MessageRepository from "../repositories/MessageRepository";
import ChatRepository from "../repositories/ChatRepository";
import TransactionRepository from "../repositories/TransactionRepository";
import PlatformRepository from "../repositories/PlatformRepository";
import dotenv from 'dotenv';
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
const paymentService = new PaymentService(UserRepository,JobRepository,ProposalRepository,PaymentRepository,ContractRepository, NotificationRepository, ReviewRepository,WalletRepository,TransactionRepository, PlatformRepository)
const paymentController = new PaymentController(paymentService)
const messageService = new ChatService(ChatRepository,MessageRepository,UserRepository)
const chatController = new ChatController(messageService)


//*common user routes
userRouter.post('/signup',authController.signUp.bind(authController));
userRouter.post('/verify-otp',authController.verifyOtp.bind(authController));
userRouter.post('/signin',authController.signIn.bind(authController))
userRouter.post('/google-auth',authController.googleSignIn.bind(authController))
userRouter.post('/resend-otp',authController.resendOtp.bind(authController))
userRouter.post('/forgot-password',authController.forgotPassword.bind(authController))
userRouter.post('/verify-forgot-otp',authController.verifyForgotPassOtp.bind(authController))
userRouter.post('/reset-password',authController.resetPassword.bind(authController))
userRouter.post('/logout',authController.logout.bind(authController))
userRouter.post('/auth/refresh-token',authController.refreshAccessToken.bind(authController))
userRouter.post('/auth/check-user',authController.userExist.bind(authController))



//* freelancer routes
userRouter.post('/freelancer/profile',upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.createFreelancerProfile.bind(userController))
userRouter.put('/freelancer/profile',upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.updateFreelancerProfile.bind(userController))
userRouter.get('/profile',authMiddleware,authorizeRole(['freelancer', 'client']),userController.getUserProfile.bind(userController))

userRouter.get('/jobs/available',authMiddleware,authorizeRole(['freelancer','admin']),jobController.getJobs.bind(jobController))
userRouter.get('/jobs/:jobId',authMiddleware,authorizeRole('freelancer'),jobController.getJob.bind(jobController))
userRouter.get('/jobs/client/:clientId',authMiddleware,authorizeRole('freelancer'),jobController.getClientProfileByJob.bind(jobController))
userRouter.post('/proposals',uploadProposal.single('attachments'),authMiddleware,authorizeRole('freelancer'),jobController.createProposal.bind(jobController))
userRouter.get('/proposals',authMiddleware,authorizeRole('freelancer'),jobController.getProposalsByFreelancer.bind(jobController))
userRouter.get('/onboard-freelancer',authMiddleware,authorizeRole('freelancer'),paymentController.createConnectedAccount.bind(paymentController))
userRouter.get('/freelancers/:freelancerId/account',authMiddleware,authorizeRole('freelancer'),paymentController.getStripeAccount.bind(paymentController))
userRouter.get('/notifications',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.getNotifications.bind(paymentController))
userRouter.put('/notifications/:id/read',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.markNotificationAsRead.bind(paymentController))
userRouter.put('/notifications/read-all',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.markAllNotificationsAsRead.bind(paymentController))
userRouter.get('/contracts',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.getContractsByUser.bind(paymentController))
userRouter.post('/contracts/:id/submit',authMiddleware,authorizeRole('freelancer'),paymentController.submitContract.bind(paymentController))
userRouter.get('/contracts/active',authMiddleware,authorizeRole('freelancer'),paymentController.getActiveAndCompletedContracts.bind(paymentController))
userRouter.get('/wallet',authMiddleware,authorizeRole('freelancer'),paymentController.getFreelancerWallet.bind(paymentController))
userRouter.post('/wallet/withdrawals',authMiddleware,authorizeRole('freelancer'),paymentController.createWithdrawal.bind(paymentController))
userRouter.get('/wallet/transactions',authMiddleware,authorizeRole('freelancer'),paymentController.getWalletTransactions.bind(paymentController))


userRouter.post('/users/:id',authMiddleware,authorizeRole('freelancer'),userController.getChatPartner.bind(userController))
userRouter.post('/gigs',authMiddleware,authorizeRole('freelancer'),jobController.createGig.bind(jobController))
userRouter.put('/gigs/:id',authMiddleware,authorizeRole('freelancer'),jobController.updateGig.bind(jobController))
userRouter.get('/gigs',authMiddleware,authorizeRole('freelancer'),jobController.getMyGigs.bind(jobController))
userRouter.delete('/gigs/:id',authMiddleware,authorizeRole('freelancer'),jobController.deleteGig.bind(jobController))
userRouter.get('/invitations',authMiddleware,authorizeRole('freelancer'),jobController.getJobInvitations.bind(jobController))
userRouter.put('/invitations/:id/reject',authMiddleware,authorizeRole('freelancer'),jobController.rejectInvitaion.bind(jobController))
userRouter.put('/invitations/:id/accept',authMiddleware,authorizeRole('freelancer'),jobController.acceptInvitaion.bind(jobController))


userRouter.post('/message',uploadChatMedia.single('media'),authMiddleware,authorizeRole(['freelancer', 'client']),chatController.createMessage.bind(chatController))
userRouter.post('/chats/chat',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getChat.bind(chatController))
userRouter.post('/chat',authMiddleware,authorizeRole('freelancer'),chatController.createChat.bind(chatController))
userRouter.get('/chats',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getChatContacts.bind(chatController))
userRouter.get('/messages',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getMessagesByChat.bind(chatController))
userRouter.put('/messages/mark-read',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.markMessagesAsRead.bind(chatController))
userRouter.put('/messages/delete-message',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.deleteMessage.bind(chatController))
userRouter.get('/messages/unread',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getUserUnreadChatsCount.bind(chatController))


//* client routes

userRouter.post('/client/profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.createProfile.bind(userController))
userRouter.put('/client/profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.updateProfile.bind(userController))
userRouter.put('/change-password',authMiddleware,userController.changePassword.bind(userController))

userRouter.get('/categories/all',authMiddleware,authorizeRole(['client','freelancer']),jobController.getCategories.bind(jobController))
userRouter.post('/jobs',authMiddleware,authorizeRole('client'),jobController.createJob.bind(jobController))
userRouter.put('/jobs/:jobId',authMiddleware,authorizeRole('client'),jobController.updateJob.bind(jobController))
userRouter.delete('/jobs/:jobId',authMiddleware,authorizeRole('client'),jobController.deleteJob.bind(jobController))
userRouter.get('/jobs',authMiddleware,authorizeRole('client'),jobController.getClientJobs.bind(jobController))
userRouter.get('/jobs/active',authMiddleware,authorizeRole('client'),jobController.getActiveJobPosts.bind(jobController))

userRouter.get('/freelancers',authMiddleware,authorizeRole('client'),userController.getAllFreelancers.bind(userController))
userRouter.get('/clients/me/proposals',authMiddleware,authorizeRole('client'),jobController.getProposalsByClient.bind(jobController))
userRouter.get('/invitations/sent',authMiddleware,authorizeRole('client'),jobController.getSentInvitations.bind(jobController))
userRouter.get('/proposals/:proposalId',authMiddleware,authorizeRole('client'),jobController.getProposalById.bind(jobController))
userRouter.put('/proposals/:proposalId/status',authMiddleware,authorizeRole(['client','freelancer']),jobController.updateProposalStatus.bind(jobController))
userRouter.get('/gigs/all',authMiddleware,authorizeRole('client'),jobController.getFreelancersGigs.bind(jobController))
userRouter.post('/invitations',authMiddleware,authorizeRole('client'),jobController.createFreelancerJobInvitation.bind(jobController))
userRouter.post('/checkout-session',authMiddleware,authorizeRole('client'),userController.createCheckout.bind(userController))

userRouter.post('/payment-intent',authMiddleware,authorizeRole('client'),paymentController.createPaymentIntend.bind(paymentController))
userRouter.post('/contracts',authMiddleware,authorizeRole('client'),paymentController.createContract.bind(paymentController))
userRouter.post('/release-payment',authMiddleware,authorizeRole('client'),paymentController.releasePayment.bind(paymentController))

userRouter.post('/reviews',authMiddleware,authorizeRole(['client','freelancer']),paymentController.submitReviewAndRating.bind(paymentController))
userRouter.get('/reviews/submitted',authMiddleware,authorizeRole(['client','freelancer']),paymentController.getSubmittedReviews.bind(paymentController))
userRouter.get('/reviews',authMiddleware,authorizeRole(['client','freelancer']),paymentController.getReviews.bind(paymentController))
userRouter.get('/review-stats',authMiddleware,authorizeRole(['client','freelancer']),paymentController.getReviewStats.bind(paymentController))

 

 

export default userRouter;