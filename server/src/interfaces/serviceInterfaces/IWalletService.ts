import { PaginatedResponse } from "../../types/commonTypes";
import { ITransaction } from "../entities/ITransaction";
import { IWallet } from "../entities/IWallet";

export interface IWalletService {
    getFreelancerWallet(userId:string): Promise<IWallet|null>
    createWithdrawal(userId:string,amount:number): Promise<boolean>
    getWalletTransactions(userId:string, page: number, limit: number): Promise<PaginatedResponse<ITransaction>>

}