import { IUser, IUserResponse,SignUpData } from "../entities/IUser";

export interface IAuthService {
    signUp(data: SignUpData): Promise<{message:string, email:string,role:string,expiresIn:number}> ;
    verifyOtp(email: string, otp: string): Promise<{message:string,user: IUserResponse, accessToken: string}> ;
    verifyUser(identifier: string, password: string): Promise<{message:string, user: IUserResponse, accessToken: string}>
    googleSignIn(credential: string): Promise<{ user: IUserResponse; accessToken: string }>;
    resendOtp(email:string): Promise<{message:string, email:string}>
    forgotPassword(email:string): Promise<{message:string,email:string,expiresIn:number}>
    verifyForgotPassOtp(email:string, otp:string): Promise<{message:string,email:string}>
    resetPassword(password:string, email:string): Promise<{message:string}>
    logout(userId:string): Promise<{message:string}>
}