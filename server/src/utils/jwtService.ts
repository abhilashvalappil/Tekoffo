import jwt from "jsonwebtoken";
import config from "../config/index";
import { JWT_SECRET } from '../config/index'

export class JwtService {
     generateAccessToken(id:string,role:string,email:string): string {
        const accessToken = jwt.sign(
            { id, role, email },
            // config.ACCESS_TOKEN_SECRET,
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          // console.log('Access token generated with secret:', JWT_SECRET);
          return accessToken;
    }

    generateRefreshToken(id:string,role:string,email:string): string {
        const refreshToken = jwt.sign(
            { id, role, email },
            // config.ACCESS_TOKEN_SECRET,
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          // console.log('Refresh token generated with secret:', JWT_SECRET);
          return refreshToken;
    }
    
}