import { Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";
import { IWalletService } from "../interfaces";

interface AuthRequest extends Request {
  userId?: string;
}

export class WalletController {
    private walletService: IWalletService;

    constructor(walletService: IWalletService){
        this.walletService = walletService;
    }

    async getFreelancerWallet(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
        try {
        const userId = req.userId;
        if (!userId) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
            return;
        }
        const wallet = await this.walletService.getFreelancerWallet(userId)
        if (!wallet) {
            res.status(Http_Status.NOT_FOUND).json({ error: MESSAGES.WALLET_NOT_FOUND });
            return;
            }
            res.status(Http_Status.OK).json({ wallet });
        } catch (error) {
        next(error);
        }
    }

    async createWithdrawal(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
        try {
        const userId = req.userId;
        if (!userId) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
            return;
        }

        const { amount } = req.body;
        if (!amount || amount <= 0) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.INVALID_AMOUNT});
        }
        const success = await this.walletService.createWithdrawal(userId,amount)
        if (success) {
                res.status(Http_Status.OK).json({ message: MESSAGES.WITHDRAWAL_SUCCESS });
            } else {
                res.status(Http_Status.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.WITHDRAWAL_FAILED });
            }
        } catch (error) {
        next(error);
        }
    }

    async getWalletTransactions(req: AuthRequest,res: Response,next: NextFunction): Promise<void>{
        try {
        const userId = req.userId;
        if (!userId) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 8;

        if (isNaN(page) || page < 1){
            res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
        }
        if (isNaN(limit) || limit < 1){
            res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
        }

        const transactions = await this.walletService.getWalletTransactions(userId,page,limit)
        if(!transactions){
            res.status(Http_Status.NOT_FOUND).json({message:MESSAGES.TRANSACTION_NOT_FOUND})
        }
        res.status(Http_Status.OK).json({transactions})
        } catch (error) {
        next(error);
        }
    }


}