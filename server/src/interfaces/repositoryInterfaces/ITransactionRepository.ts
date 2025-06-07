import { ITransaction, ITransactionWithUsername } from "../entities/ITransaction";

export interface ITransactionRepository {
    createTransaction(data:Partial<ITransaction>):Promise<void>
    findTransactions(userId:string,skip: number, limit: number): Promise<ITransaction[]>
    countTransactionsByUserId(userId:string): Promise<number>
    findAllTransactions(): Promise<ITransactionWithUsername[]>
}