
export interface IJwtService {
    generateAccessToken(id:string,role:string,email:string): string;
    generateRefreshToken(id:string,role:string,email:string): string;
}