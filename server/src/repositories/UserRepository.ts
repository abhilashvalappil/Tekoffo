import User from '../models/UserModel'
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import BaseRepository from './BaseRepository';

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(){
    super(User)
  }
    async createUser(user: Partial<IUser>): Promise<IUser>{
        return await this.create(user)
    }
    async findByEmail(email: string): Promise<IUser | null> {
        return await this.findOne({ email });
      }

      async findByUserName(username: string): Promise<IUser | null>{
        return await this.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
      }

      async findByEmailOrUsername(identifier: string): Promise<IUser | null> {
        return await this.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });
    }

     async findByEmailAndUpdate(email:string, updateData: Partial<IUser>): Promise<IUser | null> {
      return await this.findOneAndUpdate({email}, updateData);
     }
}

export default new UserRepository();