import { IUser, IUserResponse,SignUpData } from "./IUser";

export interface IUserService {
    signUp(data: SignUpData): Promise<{message:string, email:string}> ;
    verifyOtp(email: string, otp: string): Promise<{user: IUser, accessToken: string}> ;
    verifyUser(identifier: string, password: string): Promise<{user: IUserResponse, accessToken: string}>
    googleSignIn(credential: string): Promise<{ user: IUserResponse; accessToken: string }>;
    resendOtp(email:string): Promise<{message:string, email:string}>
    forgotPassword(email:string): Promise<{message:string,email:string}>
    verifyForgotPassOtp(email:string, otp:string): Promise<{message:string,email:string}>
    resetPassword(password:string, email:string): Promise<{message:string}>
}