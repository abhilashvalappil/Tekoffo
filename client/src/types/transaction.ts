export interface ITransaction {
  _id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;  
  updatedAt: string;  
}

export interface TransactionWithUsername {
  _id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string; // ISO string
  username: string;
}
