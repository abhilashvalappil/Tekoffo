import jwt from "jsonwebtoken";
import config from '../config';

export class JwtService {
     generateAccessToken(id:string,role:string,email:string): string {
        const accessToken = jwt.sign(
            { id, role, email },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
          );
          return accessToken;
    }

    generateRefreshToken(id:string,role:string,email:string): string {
        const refreshToken = jwt.sign(
            { id, role, email },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: '7d' }
          );
          return refreshToken;
    }
    
}