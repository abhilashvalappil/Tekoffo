import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import { JwtService } from "../utils/jwtService";
import { CookieHandlerService } from "../utils/cookieHandlerService";
import { OAuth2Client } from 'google-auth-library';

const userRouter = Router();

const jwtService = new JwtService();
const cookieHandlerService = new CookieHandlerService();
const googleClient = new OAuth2Client(process.env.CLIENT_ID);
const userService = new UserService(UserRepository, jwtService,googleClient); 
const userController = new UserController(userService,cookieHandlerService);

userRouter.post('/signup',userController.signUp.bind(userController));
userRouter.post('/verify-otp',userController.verifyOtp.bind(userController));
userRouter.post('/signin',userController.signIn.bind(userController))
userRouter.post('/google-auth',userController.googleSignIn.bind(userController))
userRouter.post('/resend-otp',userController.resendOtp.bind(userController))
userRouter.post('/forgot-password',userController.forgotPassword.bind(userController))
userRouter.post('/verify-forgot-otp',userController.verifyForgotPassOtp.bind(userController))
userRouter.post('/reset-password',userController.resetPassword.bind(userController))


export default userRouter;