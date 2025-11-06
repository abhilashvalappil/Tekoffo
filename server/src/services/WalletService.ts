import { Types } from "mongoose";
import { MESSAGES } from "../constants/messages";
import { NotFoundError, UnauthorizedError, ValidationError } from "../errors/customErrors";
import { ITransaction, ITransactionRepository, IUserRepository, IWallet, IWalletRepository, IWalletService } from "../interfaces";
import { TRANSACTION_TYPE } from "./PaymentService";
import { PaginatedResponse } from "../types/commonTypes";


export class WalletService implements IWalletService {
    private userRepository: IUserRepository;
    private walletRepository: IWalletRepository;
    private transactionRepository: ITransactionRepository;

    constructor(userRepository: IUserRepository,walletRepository: IWalletRepository,transactionRepository: ITransactionRepository){
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    async getFreelancerWallet(userId: string): Promise<IWallet | null> {
        const freelancer = await this.userRepository.findUserById(userId);
        if (!freelancer) {
        throw new UnauthorizedError(MESSAGES.FREELANCER_NOT_FOUND);
        }
        const wallet = await this.walletRepository.findWallet(userId);
        return wallet;
    }

    async createWithdrawal(userId: string, amount: number): Promise<boolean> {
        const freelancer = await this.userRepository.findUserById(userId);
        if (!freelancer) {
        throw new UnauthorizedError(MESSAGES.FREELANCER_NOT_FOUND);
        }
        const wallet = await this.walletRepository.findWallet(userId);
        if (!wallet) {
        throw new NotFoundError(MESSAGES.WALLET_NOT_FOUND);
        }

        if (wallet.currentBalance < amount) {
        throw new ValidationError(MESSAGES.INSUFFICIENT_BALANCE);
        }
        const success = await this.walletRepository.processWithdrawal(
        userId,
        amount
        );
        const WithDrawtransactionData = {
        userId: new Types.ObjectId(userId),
        type: TRANSACTION_TYPE.DEBIT,
        amount: amount,
        description: 'Withdrawal to bank account',
        }
        await this.transactionRepository.createTransaction(WithDrawtransactionData)
        return success;
    }

    async getWalletTransactions(userId:string,page: number,limit: number): Promise<PaginatedResponse<ITransaction>>{
        const userExist = await this.userRepository.findUserById(userId);
        if(!userExist){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const skip = (page - 1) * limit;
        const [transactions,total] = await Promise.all([
        this.transactionRepository.findTransactions(userId,skip, limit),
        this.transactionRepository.countTransactionsByUserId(userId)
        ]) 
        return {
                data: transactions,
                meta: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit,
                },
            };
        }

}