import { Request,Response } from "express";
import { IUserService } from "../interfaces/IUserService";
import { ICookieHandlerService } from "../interfaces/ICookieService";
import { ErrorHandler } from "../middlewares/errorHandler";
import { ValidationError } from "../utils/customErrors";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';

export class UserController {
    private userService: IUserService;
    private cookieHandlerService: ICookieHandlerService;

    constructor(userService: IUserService, cookieHandlerService: ICookieHandlerService) {
        this.userService = userService;
        this.cookieHandlerService = cookieHandlerService
    }

    async signUp(req:Request, res:Response): Promise<void> {
        try {
            const {username, email, password,role} = req.body;
            if (!username || !email || !password || !role) {
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.ALL_FIELDS_REQUIRED)
            }
            const result = await this.userService.signUp({username,email,password,role})
            res.status(Http_Status.OK).json({success:true, message:result.message, email:result.email})
        } catch (error) {
            ErrorHandler.handleError(error,res)
        }
    }

    async resendOtp(req:Request, res:Response): Promise<void> {
        try {
            const {email} = req.body;
            if(!email){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_REQUIRED)
            }
            const result = await this.userService.resendOtp(email)
            res.status(Http_Status.OK).json({success:true, message:result.message, email:result.email})
        } catch (error) {
            ErrorHandler.handleError(error,res)
        }
    }

    async verifyOtp(req:Request, res:Response): Promise<void>{
        try {
            const {email, otp} = req.body;

            if(!email || !otp){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_AND_OTP_REQUIRED)
            }
            const {user , accessToken } = await this.userService.verifyOtp(email,otp)
            this.cookieHandlerService.setCookie(res, accessToken);
            console.log(res,"responseeeeeeeeeee")

              res.status(Http_Status.CREATED).json({
                success: true,
                message:MESSAGES.OTP_VERIFIED,
                email: user.email
              })
        } catch (error:any) {
              ErrorHandler.handleError(error,res)
        }
    }

    async verifyForgotPassOtp(req:Request, res:Response): Promise<void>{
        try {
            const {email,otp} = req.body;
            if(!email || !otp){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_AND_OTP_REQUIRED)
            }
            const result = await this.userService.verifyForgotPassOtp(email,otp)
            res.status(Http_Status.OK).json({success:true, message:result.message, email:result.email})
        } catch (error) {
            ErrorHandler.handleError(error, res)
        }
    }

    async signIn(req:Request, res:Response): Promise<void>{
        try {
            const {identifier, password} = req.body;
            if(!identifier || !password){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.ALL_FIELDS_REQUIRED)
            }
            const result = await this.userService.verifyUser(identifier, password);
            console.log("signinnnnnnnnnnnnnn controlerrrrrrrrr",result)
            this.cookieHandlerService.setCookie(res, result.accessToken)
            res.status(Http_Status.OK).json(result);
        } catch (error) {
            ErrorHandler.handleError(error,res)
        }
    }

    async forgotPassword(req:Request, res:Response): Promise<void> {
        try {
            const {email} = req.body;
            if(!email){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_REQUIRED)
            }
            const result = await this.userService.forgotPassword(email)
            res.status(Http_Status.CREATED).json({success:true, message:result.message, email:result.email})
        } catch (error) {
            ErrorHandler.handleError(error,res)
        }
    }

    async resetPassword(req:Request, res:Response): Promise<void> {
        try {
            const {password, email} = req.body;
            if(!password){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.PASSWORD_REQUIRED)
            }
            if(!email){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_NOT_FOUND)
            }
            const result = await this.userService.resetPassword(password,email)
            res.status(Http_Status.OK).json({success:true, message:result.message})
        } catch (error) {
            ErrorHandler.handleError(error,res)
        }
    }

    async googleSignIn(req: Request, res: Response): Promise<void> {
        try {
          const { credential } = req.body;  
          if (!credential) {
            res.status(Http_Status.BAD_REQUEST).json(MESSAGES.MISSING_CREDENTIALS)
            return;
          }

          const result = await this.userService.googleSignIn(credential);
          res.status(200).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
          });
        } catch (error: any) {
          console.error('Google Sign-In Error:', error);
          res.status(401).json({
            success: false,
            message: error.message || 'Google authentication failed',
          });
        }
    }
    
}

