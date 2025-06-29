import User from '../models/UserModel'
import { IUser,IUserRepository } from '../interfaces';
import BaseRepository from './BaseRepository';
import { FreelancerData } from '../interfaces/entities/IJob';
import { FilterQuery } from 'mongoose';

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

    async findUsers(skip: number, limit: number,search?: string): Promise<IUser[]> {
      const query: FilterQuery<IUser> = {
        role: { $ne: 'admin' },
      }
      if(search){
        const searchRegex = new RegExp(search,'i');
        query.$or = [
          {username: searchRegex},
          {email: searchRegex}
        ]
      }
      return await this.find(query,{ skip, limit, sort: { createdAt: -1 } });
    }

    async countUsers(search?: string): Promise<number> {
      const query: FilterQuery<IUser> = {
        role: { $ne: 'admin' },
      };

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { username: searchRegex },
          { email: searchRegex }
        ];
      }
      return await this.count(query);
  }


    async getTotalClientsCount(): Promise<number>{
      return await this.count({ role: 'client' }); 
    } 
    async getTotalFreelancersCount(): Promise<number>{
      return await this.count({ role: 'freelancer' }); 
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

   async checkStripeAccount(freelancerId: string): Promise<boolean> {
        const freelancer = await this.findById(freelancerId);
        return !!freelancer?.stripeAccountId;
    }
  
}

export default new UserRepository();