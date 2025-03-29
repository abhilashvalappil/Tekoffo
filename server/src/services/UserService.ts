import bcrypt from "bcrypt";
import { transporter } from '../config/nodemailer.config';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { IUser,UserRole,IUserResponse,SignUpData } from "../interfaces/IUser";
import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { otpGenerator } from "../utils/OtpGenerator";
import { redisClient } from "../config/redis";
import { IJwtService } from "../interfaces/IJwtService";
import { ICookieHandlerService } from "../interfaces/ICookieService";
import { MESSAGES } from '../constants/messages';
import { CustomError,ValidationError,ConflictError,NotFoundError,UnauthorizedError } from "../utils/customErrors";


 

export class UserService implements IUserService {
    private userRepository: IUserRepository;
    private jwtService : IJwtService;
    private client = new OAuth2Client(process.env.CLIENT_ID);
     

   constructor(userRepository: IUserRepository, jwtService: IJwtService,client: OAuth2Client){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.client = client;
         
    }
   
        async signUp(data: SignUpData): Promise<{message: string, email: string}> {

            const userNameExist = await this.userRepository.findByUserName(data.username);
            if(userNameExist){
                throw new ConflictError(MESSAGES.USERNAME_ALREADY_EXISTS)
            }

            const emailExist = await this.userRepository.findByEmail(data.email);
            if(emailExist){
                throw new ConflictError(MESSAGES.EMAIL_ALREADY_EXISTS)
            }

            data.password = await bcrypt.hash(data.password,10)

            const otp = otpGenerator();
            console.log("the ottttttttppppppppppp",otp)

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: data.email,
                subject: 'Welcome to Tekoffo',
                text: `Your OTP is: ${otp}`, 
              };

              try {
                await transporter.sendMail(mailOptions)
                console.log("OTP sent successfully");
              } catch (error) {
                console.error("Error sending email:", error);
              }

              await redisClient.set(`otp:${data.email}`, otp, { EX: 30 });
              await redisClient.set(`signup:${data.email}`, JSON.stringify(data), { EX: 300 });

            return {message:MESSAGES.REGISTRATION_OTP_SENT, email: data.email };
    }

    async verifyOtp(email: string, otp: string): Promise<{user: IUser, accessToken: string}> {
        try {
          const storedOtp = await redisClient.get(`otp:${email}`);
          const storedUserData = await redisClient.get(`signup:${email}`);
          if (!storedOtp || !storedUserData) {
              throw new NotFoundError(MESSAGES.OTP_EXPIRED_OR_INVALID);
            }
          if (storedOtp !== otp) {
              throw new ValidationError(MESSAGES.INVALID_OTP);
            }

          const userData = JSON.parse(storedUserData);
          const saveUser = await this.userRepository.createUser(userData);
          await redisClient.del(`otp:${email}`);
          await redisClient.del(`signup:${email}`);

          const accessToken = this.jwtService.generateAccessToken(saveUser._id, saveUser.role, saveUser.email);
          const refreshToken = this.jwtService.generateRefreshToken(saveUser._id, saveUser.role, saveUser.email);
    
          await redisClient.set(saveUser._id.toString(), refreshToken);
          return { user: saveUser, accessToken };  
      } catch (error: any) {
          if (error instanceof CustomError) throw error;  
          throw new CustomError(`Internal error: ${error.message}`);  
      }     
    }

    async resendOtp(email: string): Promise<{message: string, email: string}> {
      try {

        const storedUserData = await redisClient.get(`signup:${email}`);
        if (!storedUserData) {
          throw new NotFoundError(MESSAGES.SIGNUP_EXPIRED);
      }
        const userData = JSON.parse(storedUserData);
        const otp = otpGenerator();
        console.log("Resentttttttttttt OTP:", otp);

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Welcome to Tekoffo',
            text: `Your new OTP is: ${otp}`,
          };
        
          await transporter.sendMail(mailOptions)
          console.log("OTP resent successfully");

          await redisClient.set(`otp:${email}`, otp, { EX: 30 });
          await redisClient.expire(`signup:${email}`, 300);

        return {message:MESSAGES.REGISTRATION_OTP_SENT,email}
      } catch (error:any) {
        if (error instanceof CustomError) throw error;  
        throw new CustomError(`Internal error: ${error.message}`); 
      }
    }

    async verifyUser(identifier:string, password:string): Promise<{user:IUserResponse,message:string, accessToken:string}> {
        try {
             
            const user = await this.userRepository.findByEmailOrUsername(identifier);
            if(!user){
                throw new NotFoundError(MESSAGES.INVALID_USER)
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if(!isValidPassword){
                throw new UnauthorizedError(MESSAGES.INVALID_PASSWORD)
            }

            const accessToken = this.jwtService.generateAccessToken(user._id,user.role,user.email);
            const refreshToken = this.jwtService.generateRefreshToken(user._id,user.role,user.email);
            await redisClient.set(user._id.toString(),refreshToken)

            return{message:MESSAGES.SIGNIN_SUCCESS,
                user:{
                    _id:user._id.toString(),
                    email:user.email,
                    username: user.username,
                    role: user.role,
                },
                accessToken,
            }
        } catch (error:any) {
            if (error instanceof CustomError) throw error;  
            throw new CustomError(`Internal error: ${error.message}`);  
        }
    }

    async forgotPassword(email:string): Promise<{message:string,email:string}> {
      try {
        const userExist = await this.userRepository.findByEmail(email);
        if(!userExist){
          throw new NotFoundError(MESSAGES.EMAIL_NOT_FOUND)
        }

        const otp = otpGenerator();
        console.log("Fogot password OTP:", otp);

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Reset Your Password',
            text: `Your OTP is: ${otp}`,
          };
        
          await transporter.sendMail(mailOptions)
          console.log("Fogot password OTP sent successfully");

          await redisClient.set(`otp:${email}`, otp, { EX: 30 });
          await redisClient.set(`forgot:${email}`,JSON.stringify(email), {EX:300});
          return {message:MESSAGES.FORGOT_PASS_OTP, email:email}
      } catch (error:any) {
        if (error instanceof CustomError) throw error;  
            throw new CustomError(`Internal error: ${error.message}`);  
      }
    }

    async verifyForgotPassOtp(email:string, otp:string): Promise<{message:string,email:string}> {
      try {
        
        const storedOtp = await redisClient.get(`otp:${email}`);
        const storedEmail = await redisClient.get(`forgot:${email}`)

        if(!storedOtp || !storedEmail){
          throw new NotFoundError(MESSAGES.OTP_EXPIRED)
        }

        if(storedOtp !== otp){
          throw new ValidationError(MESSAGES.INVALID_OTP)
        }
        return {message:MESSAGES.OTP_VERIFIED,email:email}
      } catch (error:any) {
        if (error instanceof CustomError) throw error;  
            throw new CustomError(`Internal error: ${error.message}`);  
      }
    }

    async resetPassword(password:string, email:string): Promise<{message:string}> {
      try {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
          throw new NotFoundError(MESSAGES.EMAIL_NOT_FOUND)
        }
          const hashedPassword = await bcrypt.hash(password,10)
          await this.userRepository.findByEmailAndUpdate(email, {password: hashedPassword})
          return {message:MESSAGES.PASSWORD_RESET_SUCCESS}
      } catch (error:any) {
        if (error instanceof CustomError) throw error;  
            throw new CustomError(`Internal error: ${error.message}`); 
      }
    }

    async googleSignIn(credential: string): Promise<{ user: IUserResponse; accessToken: string }> {
        try {
         
          const ticket = await this.client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID,
          });
          const payload = ticket.getPayload();
          if (!payload || !payload.email) {
            throw new Error('Invalid Google token payload');
          }
    
          const { email, sub: googleId, name } = payload;
 
          let user = await this.userRepository.findByEmail(email);
          if (!user) {
            user = await this.userRepository.createUser({
              email,
              username: name || email.split('@')[0],
              googleId,
              role: 'client' as UserRole,  
            });
          }
    
          const userResponse: IUserResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          };
    
          const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
    
          return { user: userResponse, accessToken };
        } catch (error: any) {
          throw new Error(error.message || 'Google Sign-In failed');
        }
      }
}