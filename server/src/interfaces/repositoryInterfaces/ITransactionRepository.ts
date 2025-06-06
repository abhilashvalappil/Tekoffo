import { ITransaction, ITransactionWithUsername } from "../entities/ITransaction";

export interface ITransactionRepository {
    createTransaction(data:Partial<ITransaction>):Promise<void>
    findTransactions(userId:string): Promise<ITransaction[]>
    findAllTransactions(): Promise<ITransactionWithUsername[]>
}