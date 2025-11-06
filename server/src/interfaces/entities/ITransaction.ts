import {Document,Types} from "mongoose";

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    createdAt?: Date;
}

export interface ITransactionWithUsername {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: Date;
  username: string;
}