export interface IWallet {
  _id: string;
  userId: string;
  currentBalance: number;
  totalEarnings: number;
  pendingEarnings: number;
  withdrawnAmount: number;
  createdAt: Date;  
  updatedAt: Date;  
}
