import { ITransaction, ITransactionRepository, ITransactionWithUsername } from "../interfaces";
import BaseRepository from "./BaseRepository";
import Transaction from '../models/TransactionModel'
import { Types } from "mongoose";

class TransactionRepository extends BaseRepository<ITransaction> implements ITransactionRepository {
    constructor(){
        super(Transaction)
    }

    async createTransaction(data:Partial<ITransaction>):Promise<void>{
        await this.create(data)
    }

    async findTransactions(userId:string): Promise<ITransaction[]>{
        return await Transaction.find({userId: new Types.ObjectId(userId)})
    }

    async findAllTransactions(): Promise<ITransactionWithUsername[]>{
        const transactions = await Transaction.aggregate([
            {
            $lookup: {
                from: 'users', 
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
            },
            {
            $unwind: '$userInfo'  
            },
            {
            $project: {
                _id: 1,
                userId: 1,
                type: 1,
                amount: 1,
                description: 1,
                createdAt: 1,
                username: '$userInfo.username'
             }
            }
        ]);

        return transactions;
        }

}

export default new TransactionRepository();