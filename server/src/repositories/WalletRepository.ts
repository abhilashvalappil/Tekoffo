
import { Types } from 'mongoose';
import { IWallet, IWalletRepository } from '../interfaces';
import Wallet from '../models/WalletModel'
import BaseRepository from './BaseRepository';

class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor(){
        super(Wallet)
    }

    async createWallet(userId:string): Promise<IWallet>{
        return await this.create({userId: new Types.ObjectId(userId)})
    }

    async findWallet(freelancerId:string): Promise<IWallet|null>{
        return await this.findOne({userId: new Types.ObjectId(freelancerId)})
    }

    async updateWallet(freelancerId:string,amount:number): Promise<IWallet|null>{
        return await Wallet.findOneAndUpdate(
            {userId:new Types.ObjectId(freelancerId)},
            {$inc:{
                totalEarnings:amount,
                currentBalance: amount,
                pendingEarnings: -amount,
            }
        },
            {new:true}
        )
    };

    async updateWalletPendingEarnings(freelancerId:string,amount:number): Promise<IWallet|null>{
        return await Wallet.findOneAndUpdate(
            {userId:new Types.ObjectId(freelancerId)},
            {$inc:{
                pendingEarnings:amount
            }},
            {new:true}
        )
    }

    async processWithdrawal(freelancerId:string,amount:number): Promise<boolean>{
        const updatedWallet = await Wallet.findOneAndUpdate(
            {userId:new Types.ObjectId(freelancerId)},
            {
                $inc:{
                currentBalance: -amount,
                withdrawnAmount: amount,
            }
        },
        { new: true }
        )
        return updatedWallet !== null;
    }
}

export default new WalletRepository();