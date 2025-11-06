import {Document,Types} from "mongoose";

export interface IWallet extends Document {
    userId: Types.ObjectId;
    currentBalance: number;
    totalEarnings: number;
    pendingEarnings: number;
    withdrawnAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}