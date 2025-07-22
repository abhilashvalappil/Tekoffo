import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { transporter } from '../config/nodemailer.config';
import { OAuth2Client } from 'google-auth-library';
import { UserRole, IUserResponse, SignUpData,IAuthService,IUserRepository,IJwtService,IWalletRepository} from "../interfaces";
import { otpGenerator } from "../utils/OtpGenerator";
import { redisClient } from "../config/redis";
import { MESSAGES } from '../constants/messages';
import { JWT_SECRET } from "../config";
import { ValidationError,ConflictError,NotFoundError,UnauthorizedError } from "../errors/customErrors";
import dotenv from 'dotenv';
dotenv.config();

 

export class AuthService implements IAuthService {
    private userRepository: IUserRepository;
    private jwtService : IJwtService;
    private client = new OAuth2Client(process.env.CLIENT_ID);
    private walletRepository: IWalletRepository;
     

   constructor(userRepository: IUserRepository, jwtService: IJwtService,client: OAuth2Client,  walletRepository: IWalletRepository){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.client = client;
        this.walletRepository = walletRepository;
         
    }
   
    async signUp(data: SignUpData): Promise<{message: string, email: string, role:string,expiresIn:number}> {
        
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
        const expiresIn = 60;
        console.log("the ottttttttppppppppppp",otp)

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: data.email,
            subject: 'Welcome to Tekoffo',
            text: `Your OTP is: ${otp}`, 
          };
          await transporter.sendMail(mailOptions)
          console.log("OTP sent successfully");
          await redisClient.set(`otp:${data.email}`, otp, { EX: expiresIn });
          await redisClient.set(`signup:${data.email}`, JSON.stringify(data), { EX: 300 });

        return {message:MESSAGES.REGISTRATION_OTP_SENT, email: data.email, role:data.role, expiresIn:expiresIn };
  }

    async verifyOtp(email: string, otp: string): Promise<{message:string,user: IUserResponse, accessToken: string}> {

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

          if(saveUser.role === 'freelancer'){
            await this.walletRepository.createWallet(saveUser._id)
          }

          await redisClient.del(`otp:${email}`);
          await redisClient.del(`signup:${email}`);

          const accessToken = this.jwtService.generateAccessToken(saveUser._id, saveUser.role, saveUser.email);
          const refreshToken = this.jwtService.generateRefreshToken(saveUser._id, saveUser.role, saveUser.email);
    
          await redisClient.set(saveUser._id.toString(), refreshToken); 
          return {message:MESSAGES.USER_CREATED,
            user:{
            _id:saveUser._id.toString(),
            email:saveUser.email,
            username: saveUser.username,
            role: saveUser.role,
          },accessToken}
    }

    async resendOtp(email: string): Promise<{message: string, email: string}> {

        const storedUserData = await redisClient.get(`signup:${email}`);
        if (!storedUserData) {
          throw new NotFoundError(MESSAGES.SIGNUP_EXPIRED);
      }
        JSON.parse(storedUserData);
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
    }

    async verifyUser(identifier:string, password:string): Promise<{user:IUserResponse,message:string, accessToken:string}> {
             
            const user = await this.userRepository.findByEmailOrUsername(identifier);
            if(!user){
                throw new NotFoundError(MESSAGES.INVALID_USER)
            }
             
            if(user.isBlocked){
              throw new UnauthorizedError(MESSAGES.ACCOUNT_BLOCKED);
            }

            console.log('User found, checking password...');
            const isValidPassword = await bcrypt.compare(password, user.password);
            if(!isValidPassword){
              console.log('Invalid password');
                throw new UnauthorizedError(MESSAGES.INVALID_PASSWORD)
            }

            const accessToken = this.jwtService.generateAccessToken(user._id,user.role,user.email);
            const refreshToken = this.jwtService.generateRefreshToken(user._id,user.role,user.email);
            await redisClient.set(user._id.toString(),refreshToken)

            return{message:MESSAGES.SIGNIN_SUCCESS,
                user:{
                    _id:user._id.toString(),
                    username: user.username,
                    email:user.email,
                    role: user.role,
                    fullName: user.fullName,
                    companyName: user.companyName,
                    description: user.description,
                    country: user.country,
                    skills: user.skills,
                    preferredJobFields: user.preferredJobFields,
                    total_Spent: user.total_Spent,
                    linkedinUrl: user.linkedinUrl,                      
                    githubUrl: user.githubUrl,
                    portfolioUrl: user.portfolioUrl,
                    profilePicture: user.profilePicture || '',
                },
                accessToken,
            }
    }

    async generateAccessToken(userId:string): Promise<{accessToken:string}>{

      const user = await this.userRepository.findUserById(userId)
      if(!user){
        throw new NotFoundError(MESSAGES.INVALID_USER)
      }
      const storedToken = await redisClient.get(userId)
      if(!storedToken){
        throw new NotFoundError(MESSAGES.NO_TOKEN_FOUND)
      }

       jwt.verify(storedToken,JWT_SECRET) as { id: string; role: string; email: string };
       const newAccesstoken = this.jwtService.generateAccessToken(user._id,user.role,user.email);
       return { accessToken: newAccesstoken };
    }

    async logout(userId:string): Promise<{message:string}>{

        const user = await this.userRepository.findUserById(userId);
        if (!user) {
          throw new NotFoundError(MESSAGES.INVALID_USER);
        }
          await redisClient.del(userId.toString());
          return {message:MESSAGES.LOGOUT_SUCCESS} 
        }

    async forgotPassword(email:string): Promise<{message:string,email:string,expiresIn:number}> {
     
        const userExist = await this.userRepository.findByEmail(email);
        if(!userExist){
          throw new NotFoundError(MESSAGES.EMAIL_NOT_FOUND)
        }

        const otp = otpGenerator();
        const expiresIn = 30;
        console.log("Fogot password OTP:", otp);

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Reset Your Password',
            text: `Your OTP is: ${otp}`,
          };
        
          await transporter.sendMail(mailOptions)
          console.log("Fogot password OTP sent successfully");

          await redisClient.set(`otp:${email}`, otp, { EX: expiresIn });
          await redisClient.set(`forgot:${email}`,JSON.stringify(email), {EX:300});
          return {message:MESSAGES.FORGOT_PASS_OTP, email:email, expiresIn:expiresIn}
    }

    async verifyForgotPassOtp(email:string, otp:string): Promise<{message:string,email:string}> {
        
        const storedOtp = await redisClient.get(`otp:${email}`);
        const storedEmail = await redisClient.get(`forgot:${email}`)

        if(!storedOtp || !storedEmail){
          throw new NotFoundError(MESSAGES.OTP_EXPIRED)
        }

        if(storedOtp !== otp){
          throw new ValidationError(MESSAGES.INVALID_OTP)
        }
        return {message:MESSAGES.OTP_VERIFIED,email:email}
    }

    async resetPassword(password:string, email:string): Promise<{message:string}> {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
          throw new NotFoundError(MESSAGES.EMAIL_NOT_FOUND)
        }
          const hashedPassword = await bcrypt.hash(password,10)
          await this.userRepository.findByEmailAndUpdate(email, {password: hashedPassword})
          return {message:MESSAGES.PASSWORD_RESET_SUCCESS}
    }

   async userExist(credential:string): Promise<{user:IUserResponse | null}>{
      const ticket = await this.client.verifyIdToken({ idToken: credential, audience: process.env.CLIENT_ID });
      const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          throw new Error('Invalid Google token payload');
        }
        const user = await this.userRepository.findByEmail(payload.email);
        return {user}
    }

    async googleSignIn(credential: string,role:UserRole): Promise<{ user: IUserResponse; accessToken: string }> {
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
              role: role,  
            });
          }else{
             if(user.isBlocked){
              throw new UnauthorizedError(MESSAGES.ACCOUNT_BLOCKED);
             }
          }
     
          const accessToken = this.jwtService.generateAccessToken(user._id,user.role,user.email)
          const refreshToken = this.jwtService.generateRefreshToken(user._id,user.role,user.email);
          await redisClient.set(user._id.toString(),refreshToken)

        const userResponse: IUserResponse = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName || '',
        companyName: user.companyName || '',
        description: user.description || '',
        country: user.country || '',
        skills: user.skills || [],
        preferredJobFields: user.preferredJobFields || [],
        total_Spent: user.total_Spent || 0,
        linkedinUrl: user.linkedinUrl || '',                      
        githubUrl: user.githubUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        profilePicture: user.profilePicture || '',
    };
          return { user: userResponse, accessToken };
      }
}