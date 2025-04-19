import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import { JwtService } from "../utils/jwtService";
import { CookieHandlerService } from "../utils/cookieHandlerService";
import { OAuth2Client } from 'google-auth-library';
import authMiddleware from "../middlewares/authMiddleware";
import CategoryRepository from "../repositories/CategoryRepository";
import JobRepository from "../repositories/JobRepository";
import { authorizeRole } from "../middlewares/roleMiddleware";
import { upload } from '../utils/cloudinary';

const userRouter = Router();

const jwtService = new JwtService();
const cookieHandlerService = new CookieHandlerService();
const googleClient = new OAuth2Client(process.env.CLIENT_ID);
const authService = new AuthService(UserRepository, jwtService,googleClient); 
const authController = new AuthController(authService,cookieHandlerService);
const userService = new UserService(UserRepository,CategoryRepository,JobRepository )
const userController = new UserController(userService);


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


//* freelancer routes
userRouter.post('/create-freelancerprofile',upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.createFreelancerProfile.bind(userController))
userRouter.put('/update-freelancerprofile',upload.single('profilePicture'),authMiddleware,authorizeRole('freelancer'),userController.updateFreelancerProfile.bind(userController))
userRouter.get('/jobs/posted',authMiddleware,authorizeRole('freelancer'),userController.getAvailbleJobs.bind(userController))





//* client routes
userRouter.post('/create-profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.createProfile.bind(userController))
userRouter.put('/update-profile',upload.single('profilePicture'),authMiddleware,authorizeRole('client'),userController.updateProfile.bind(userController))
userRouter.put('/change-password',authMiddleware,userController.changePassword.bind(userController))
userRouter.get('/categories/listed',authMiddleware,authorizeRole('client'),userController.getCategories.bind(userController))
userRouter.post('/jobs/post',authMiddleware,authorizeRole('client'),userController.postJob.bind(userController))
userRouter.put('/update-job',authMiddleware,authorizeRole('client'),userController.updateJobPost.bind(userController))
userRouter.delete('/delete-job',authMiddleware,authorizeRole('client'),userController.deleteJobPost.bind(userController))
userRouter.get('/jobs/my-posts',authMiddleware,authorizeRole('client'),userController.getMyJobPosts.bind(userController))
userRouter.get('/freelancers',authMiddleware,authorizeRole('client'),userController.getAllFreelancers.bind(userController))


export default userRouter;