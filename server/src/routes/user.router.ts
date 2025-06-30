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





//* freelancer routes
userRouter.post('/create-freelancerprofile',upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.createFreelancerProfile.bind(userController))
userRouter.put('/update-freelancerprofile',upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.updateFreelancerProfile.bind(userController))
userRouter.get('/api/profile',authMiddleware,authorizeRole(['freelancer', 'client']),userController.getUserProfile.bind(userController))

userRouter.get('/jobs/posted',authMiddleware,authorizeRole(['freelancer','admin']),jobController.getAvailbleJobs.bind(jobController))
userRouter.get('/jobs/client',authMiddleware,authorizeRole('freelancer'),jobController.getClientProfileByJob.bind(jobController))
userRouter.post('/send-proposal',uploadProposal.single('attachments'),authMiddleware,authorizeRole('freelancer'),jobController.createProposal.bind(jobController))
userRouter.get('/api/proposals',authMiddleware,authorizeRole('freelancer'),jobController.getFreelancerAppliedProposals.bind(jobController))
userRouter.get('/onboard-freelancer',authMiddleware,authorizeRole('freelancer'),paymentController.createConnectedAccount.bind(paymentController))
userRouter.get('/check-stripe-account',authMiddleware,authorizeRole('freelancer'),paymentController.checkStripeAccount.bind(paymentController))
userRouter.get('/api/notifications',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.getNotifications.bind(paymentController))
userRouter.put('/api/notifications/:id/read',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.markNotificationAsRead.bind(paymentController))
userRouter.put('/api/notifications/mark-all-read',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.markAllNotificationsAsRead.bind(paymentController))
userRouter.get('/contracts',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.getUserContracts.bind(paymentController))
userRouter.post('/contracts/submit',authMiddleware,authorizeRole('freelancer'),paymentController.submitContractForApproval.bind(paymentController))
userRouter.get('/contracts/active',authMiddleware,authorizeRole('freelancer'),paymentController.getActiveAndCompletedContracts.bind(paymentController))
userRouter.get('/api/wallet',authMiddleware,authorizeRole('freelancer'),paymentController.getFreelancerWallet.bind(paymentController))
userRouter.post('/api/wallet/withdraw',authMiddleware,authorizeRole('freelancer'),paymentController.withdrawEarnings.bind(paymentController))
userRouter.get('/api/wallet/transactions',authMiddleware,authorizeRole('freelancer'),paymentController.getWalletTransactions.bind(paymentController))


userRouter.post('/api/user',authMiddleware,authorizeRole('freelancer'),userController.getReceiver.bind(userController))
userRouter.post('/create-gig',authMiddleware,authorizeRole('freelancer'),jobController.createGig.bind(jobController))
userRouter.put('/update-gig',authMiddleware,authorizeRole('freelancer'),jobController.updateFreelancerGig.bind(jobController))
userRouter.get('/freelancer/gigs',authMiddleware,authorizeRole('freelancer'),jobController.getFreelancerGigs.bind(jobController))
userRouter.delete('/delete-gig',authMiddleware,authorizeRole('freelancer'),jobController.deleteFreelancerGig.bind(jobController))
userRouter.get('/invitations',authMiddleware,authorizeRole('freelancer'),jobController.getJobInvitations.bind(jobController))
userRouter.get('/jobs/job',authMiddleware,authorizeRole('freelancer'),jobController.getJobDetails.bind(jobController))
userRouter.put('/invitations/reject',authMiddleware,authorizeRole('freelancer'),jobController.rejectInvitaion.bind(jobController))
userRouter.put('/invitations/accept',authMiddleware,authorizeRole('freelancer'),jobController.acceptInvitaion.bind(jobController))


userRouter.post('/send-message',uploadChatMedia.single('media'),authMiddleware,authorizeRole(['freelancer', 'client']),chatController.createMessage.bind(chatController))
userRouter.post('/chats/chat',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getChat.bind(chatController))
userRouter.post('/create-chat',authMiddleware,authorizeRole('freelancer'),chatController.createChat.bind(chatController))
userRouter.get('/api/chats',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getChatContacts.bind(chatController))
userRouter.get('/api/messages',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getMessagesByChat.bind(chatController))
userRouter.put('/api/messages/mark-read',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.markMessagesAsRead.bind(chatController))
userRouter.put('/api/messages/delete-message',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.deleteMessage.bind(chatController))
userRouter.get('/api/messages/unread',authMiddleware,authorizeRole(['freelancer', 'client']),chatController.getUserUnreadChatsCount.bind(chatController))




//* client routes

userRouter.post('/create-profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.createProfile.bind(userController))
userRouter.put('/update-profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.updateProfile.bind(userController))
userRouter.put('/change-password',authMiddleware,userController.changePassword.bind(userController))

userRouter.get('/categories/listed',authMiddleware,authorizeRole(['client','freelancer']),jobController.getCategories.bind(jobController))
userRouter.post('/jobs',authMiddleware,authorizeRole('client'),jobController.createJob.bind(jobController))
userRouter.put('/update-job',authMiddleware,authorizeRole('client'),jobController.updateJobPost.bind(jobController))
userRouter.delete('/delete-job',authMiddleware,authorizeRole('client'),jobController.deleteJobPost.bind(jobController))
userRouter.get('/jobs/my-posts',authMiddleware,authorizeRole('client'),jobController.getMyJobPosts.bind(jobController))
userRouter.get('/jobs/active-jobs',authMiddleware,authorizeRole('client'),jobController.getActiveJobPosts.bind(jobController))

userRouter.get('/freelancers',authMiddleware,authorizeRole('client'),userController.getAllFreelancers.bind(userController))
userRouter.get('/proposals/received',authMiddleware,authorizeRole('client'),jobController.getReceivedProposals.bind(jobController))
userRouter.get('/invitations/sent',authMiddleware,authorizeRole('client'),jobController.getSentInvitations.bind(jobController))
userRouter.post('/proposals/proposal',authMiddleware,authorizeRole('client'),jobController.getProposal.bind(jobController))
userRouter.put('/proposals/update',authMiddleware,authorizeRole(['client','freelancer']),jobController.updateProposalStatus.bind(jobController))
userRouter.get('/gigs',authMiddleware,authorizeRole('client'),jobController.getFreelancersGigs.bind(jobController))
userRouter.post('/create-invite',authMiddleware,authorizeRole('client'),jobController.createFreelancerJobInvitation.bind(jobController))
userRouter.post('/create-checkout-session',authMiddleware,authorizeRole('client'),userController.createCheckout.bind(userController))

userRouter.post('/create-payment-intent',authMiddleware,authorizeRole('client'),paymentController.createPaymentIntend.bind(paymentController))
userRouter.post('/create-contract',authMiddleware,authorizeRole('client'),paymentController.createContract.bind(paymentController))
userRouter.post('/release-payment',authMiddleware,authorizeRole('client'),paymentController.releasePayment.bind(paymentController))

userRouter.post('/api/create-review',authMiddleware,authorizeRole(['client','freelancer']),paymentController.submitReviewAndRating.bind(paymentController))
userRouter.get('/api/reviews/submitted',authMiddleware,authorizeRole(['client','freelancer']),paymentController.getSubmittedReviews.bind(paymentController))
userRouter.get('/api/reviews',authMiddleware,authorizeRole(['client','freelancer']),paymentController.getReviews.bind(paymentController))

 

 

export default userRouter;