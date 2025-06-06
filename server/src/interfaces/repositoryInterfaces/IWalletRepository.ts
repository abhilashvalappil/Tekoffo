import { IWallet } from "../entities/IWallet";

export interface IWalletRepository {
    createWallet(userId:string): Promise<IWallet>
    findWallet(freelancerId:string): Promise<IWallet|null>
    updateWallet(freelancerId:string,amount:number): Promise<IWallet|null>
    updateWalletPendingEarnings(freelancerId:string,amount:number): Promise<IWallet|null>
    processWithdrawal(freelancerId:string,amount:number): Promise<boolean>
}