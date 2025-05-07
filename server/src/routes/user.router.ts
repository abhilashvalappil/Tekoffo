import { Router } from "express";
import express from 'express';
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { JobController } from "../controllers/JobController";
import { PaymentController } from "../controllers/PaymentController";
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
import { authorizeRole } from "../middlewares/roleMiddleware";
import { upload } from '../utils/cloudinary';
import { uploadProposal } from "../utils/cloudinary";
import { PaymentService } from "../services/PaymentService";
import NotificationRepository from "../repositories/NotificationRepository";
import ReviewRepository from "../repositories/ReviewRepository";

const userRouter = Router();

const jwtService = new JwtService();
const cookieHandlerService = new CookieHandlerService();
const googleClient = new OAuth2Client(process.env.CLIENT_ID);
const authService = new AuthService(UserRepository, jwtService,googleClient); 
const authController = new AuthController(authService,cookieHandlerService);
const userService = new UserService(UserRepository,CategoryRepository,JobRepository,ProposalRepository,PaymentRepository )
const userController = new UserController(userService);
const jobService = new JobService(CategoryRepository,UserRepository,JobRepository,ProposalRepository)
const jobController = new JobController(jobService)
const paymentService = new PaymentService(UserRepository,JobRepository,ProposalRepository,PaymentRepository,ContractRepository, NotificationRepository, ReviewRepository)
const paymentController = new PaymentController(paymentService)


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
userRouter.get('/jobs/posted',authMiddleware,authorizeRole('freelancer'),jobController.getAvailbleJobs.bind(jobController))
userRouter.get('/jobs/client',authMiddleware,authorizeRole('freelancer'),jobController.getClientProfileByJob.bind(jobController))
userRouter.post('/send-proposal',uploadProposal.single('attachments'),authMiddleware,authorizeRole('freelancer'),jobController.createProposal.bind(jobController))
userRouter.get('/api/proposals',authMiddleware,authorizeRole('freelancer'),jobController.getFreelancerAppliedProposals.bind(jobController))
userRouter.get('/onboard-freelancer',authMiddleware,authorizeRole('freelancer'),paymentController.createConnectedAccount.bind(paymentController))
userRouter.get('/check-stripe-account',authMiddleware,authorizeRole('freelancer'),paymentController.checkStripeAccount.bind(paymentController))
userRouter.get('/notifications',authMiddleware,authorizeRole('freelancer'),paymentController.getNotifications.bind(paymentController))
userRouter.put('/notifications/:id/read',authMiddleware,authorizeRole('freelancer'),paymentController.markNotificationAsRead.bind(paymentController))
userRouter.put('/notifications/read-all',authMiddleware,authorizeRole('freelancer'),paymentController.markAllNotificationsAsRead.bind(paymentController))
userRouter.get('/contracts',authMiddleware,authorizeRole(['freelancer', 'client']),paymentController.getUserContracts.bind(paymentController))
userRouter.post('/contracts/submit',authMiddleware,authorizeRole('freelancer'),paymentController.submitContractForApproval.bind(paymentController))




//* client routes

userRouter.post('/create-profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.createProfile.bind(userController))
userRouter.put('/update-profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.updateProfile.bind(userController))
userRouter.put('/change-password',authMiddleware,userController.changePassword.bind(userController))

userRouter.get('/categories/listed',authMiddleware,authorizeRole('client'),jobController.getCategories.bind(jobController))
userRouter.post('/jobs',authMiddleware,authorizeRole('client'),jobController.createJob.bind(jobController))
userRouter.put('/update-job',authMiddleware,authorizeRole('client'),jobController.updateJobPost.bind(jobController))
userRouter.delete('/delete-job',authMiddleware,authorizeRole('client'),jobController.deleteJobPost.bind(jobController))
userRouter.get('/jobs/my-posts',authMiddleware,authorizeRole('client'),jobController.getMyJobPosts.bind(jobController))

userRouter.get('/freelancers',authMiddleware,authorizeRole('client'),userController.getAllFreelancers.bind(userController))
userRouter.get('/proposals/received',authMiddleware,authorizeRole('client'),jobController.getReceivedProposals.bind(jobController))
userRouter.post('/proposals/proposal',authMiddleware,authorizeRole('client'),jobController.getProposal.bind(jobController))
userRouter.put('/proposals/update',authMiddleware,authorizeRole('client'),jobController.updateProposalStatus.bind(jobController))
userRouter.post('/create-checkout-session',authMiddleware,authorizeRole('client'),userController.createCheckout.bind(userController))
userRouter.post('/webhook', express.raw({ type: 'application/json' }),userController.handleWebhook.bind(userController))

userRouter.post('/create-payment-intent',authMiddleware,authorizeRole('client'),paymentController.createPaymentIntend.bind(paymentController))
userRouter.post('/create-contract',authMiddleware,authorizeRole('client'),paymentController.createContract.bind(paymentController))
userRouter.post('/release-payment',authMiddleware,authorizeRole('client'),paymentController.releasePayment.bind(paymentController))
userRouter.post('/api/reviews',authMiddleware,authorizeRole('client'),paymentController.submitReviewAndRating.bind(paymentController))
 

 

export default userRouter;