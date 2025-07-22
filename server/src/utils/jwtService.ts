import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config/index'

export class JwtService {
     generateAccessToken(id:string,role:string,email:string): string {
        const accessToken = jwt.sign(
            { id, role, email },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          return accessToken;
    }

    generateRefreshToken(id:string,role:string,email:string): string {
        const refreshToken = jwt.sign(
            { id, role, email },
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          return refreshToken;
    }
    
}