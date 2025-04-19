import User from '../models/UserModel'
import { IUser,IUserRepository } from '../interfaces';
import BaseRepository from './BaseRepository';
import { FreelancerData } from '../interfaces/entities/IJob';

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

     async findUserById(userId: string): Promise<IUser | null> {
      return await this.findById(userId);
  }

    async findUsers(): Promise<IUser[]> {
      return await this.find() || [];
    }

    async updateUserStatus(userId: string, isBlocked: boolean) {
      return await this.updateById(userId, { isBlocked } as Partial<IUser>);
  }

  async createUserProfile(userId: string, createProfile: Partial<IUser>): Promise<IUser | null> {
    return await this.updateById(userId, createProfile);
  }

  async updateUserProfile(userId: string, updateProfile: Partial<IUser>): Promise<IUser | null> {
    return await this.updateById(userId, updateProfile);
  }

  async findFreelancers(): Promise<FreelancerData[]> {
    return await this.find({$and:[{role:'freelancer'},{isBlocked:false}]})
  }
  
}

export default new UserRepository();