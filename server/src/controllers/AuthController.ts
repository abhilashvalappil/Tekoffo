import { Request, Response, NextFunction } from "express";
import { IAuthService,ICookieHandlerService } from "../interfaces"; 
import { ValidationError } from "../errors/customErrors";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';

export class AuthController {
    private authService: IAuthService;
    private cookieHandlerService: ICookieHandlerService;

    constructor(authService: IAuthService, cookieHandlerService: ICookieHandlerService) {
        this.authService = authService;
        this.cookieHandlerService = cookieHandlerService
    }

    async signUp(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {username, email, password, role} = req.body;
            if (!username || !email || !password || !role) {
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.ALL_FIELDS_REQUIRED})
            }
            const result = await this.authService.signUp({username,email,password,role})
            res.status(Http_Status.OK).json({
                success:true,
                message:result.message,
                email:result.email,
                role:result.role,
                expiresIn:result.expiresIn
            })
        } catch (error) {
            next(error)
        }
    }

    async resendOtp(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {email} = req.body;
            if(!email){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_REQUIRED)
            }
            const result = await this.authService.resendOtp(email)
            res.status(Http_Status.OK).json({success:true, message:result.message, email:result.email})
        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req:Request, res:Response, next: NextFunction): Promise<void>{
        try {
            const {email, otp} = req.body;

            if(!email || !otp){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_AND_OTP_REQUIRED)
            }
            const result = await this.authService.verifyOtp(email,otp)
            this.cookieHandlerService.setCookie(res, result.accessToken);
            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message,
                user:result.user,
                accessToken: result.accessToken
            })
        } catch (error:any) {
            next(error)
        }
    }

    async verifyForgotPassOtp(req:Request, res:Response, next: NextFunction): Promise<void>{
        try {
            const {email,otp} = req.body;
            if(!email || !otp){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_AND_OTP_REQUIRED)
            }
            const result = await this.authService.verifyForgotPassOtp(email,otp)
            res.status(Http_Status.OK).json({success:true, message:result.message, email:result.email})
        } catch (error) {
            next(error)
        }
    }

    async signIn(req:Request, res:Response, next: NextFunction): Promise<void>{
        try {
            const {identifier, password} = req.body;
            if(!identifier || !password){
                res.status(Http_Status.BAD_REQUEST).json({ message: MESSAGES.ALL_FIELDS_REQUIRED })
                return;
            }
            const result = await this.authService.verifyUser(identifier, password);
            
            this.cookieHandlerService.setCookie(res, result.accessToken)
            res.status(Http_Status.OK).json({
                message:result.message,
                user:result.user,
                accessToken:result.accessToken
            });
        } catch (error) {
            next(error)
        }
    }

    async refreshAccessToken(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({message:MESSAGES.INVALID_REQUEST})
            }
            const { accessToken } = await this.authService.generateAccessToken(userId)
            this.cookieHandlerService.setCookie(res,accessToken)
            res.status(Http_Status.OK).json({ accessToken });
        } catch (error) {
            next(error)
        }
    }

    async logout(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {userId} = req.body;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.INVALID_USER)
            }
            await this.authService.logout(userId);
            this.cookieHandlerService.clearCookie(res)
            res.status(Http_Status.OK).json({message:MESSAGES.LOGOUT_SUCCESS})
        } catch (error) {
            next(error)
        }
    }

    async forgotPassword(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {email} = req.body;
            if(!email){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_REQUIRED)
            }
            const result = await this.authService.forgotPassword(email)
            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message,
                email:result.email,
                expiresIn:result.expiresIn
            })
        } catch (error) {
            next(error)
        }
    }

    async resetPassword(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {password, email} = req.body;
            if(!password){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.PASSWORD_REQUIRED)
            }
            if(!email){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.EMAIL_NOT_FOUND)
            }
            const result = await this.authService.resetPassword(password,email)
            res.status(Http_Status.OK).json({success:true, message:result.message})
        } catch (error) {
            next(error)
        }
    }

    async googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { credential } = req.body;  
          if (!credential) {
            res.status(Http_Status.BAD_REQUEST).json(MESSAGES.MISSING_CREDENTIALS)
            return;
          }

          const result = await this.authService.googleSignIn(credential);
          res.status(200).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
          });
        } catch (error: any) {
            next(error)
        }
    }
    
}

