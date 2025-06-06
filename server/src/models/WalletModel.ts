import mongoose,{Schema,Types} from "mongoose";
import { IWallet } from "../interfaces";

const WalletSchema : Schema<IWallet> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    pendingEarnings: {
      type: Number,
      default: 0,
    },
    withdrawnAmount: {
      type: Number,
      default: 0,
    },
},{
    timestamps: true
}
)

export default mongoose.model<IWallet>('Wallet', WalletSchema);