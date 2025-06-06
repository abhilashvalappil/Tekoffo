import mongoose,{Schema,Types} from "mongoose";
import { ITransaction } from "../interfaces";

const TransactionSchema : Schema<ITransaction> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
         type: Number,
         required: true
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true
}
)

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);