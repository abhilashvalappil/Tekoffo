import { IUser } from "./IUser";

export interface IUserRepository {
    createUser(user: Partial<IUser>): Promise<IUser>;
    findByEmail(email:string): Promise<IUser | null>;
    findByUserName(username: string): Promise<IUser | null>;
    findByEmailOrUsername(identifier: string): Promise<IUser | null>;
    findByEmailAndUpdate(email:string,updateData: Partial<IUser>): Promise<IUser | null>;
}