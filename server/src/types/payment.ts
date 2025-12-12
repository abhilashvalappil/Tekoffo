export interface TransactionResult {
  transactionId: string;
  amount: number;
  status: "authorized" | "released" | "failed" | "inEscrow" | string;
  freelancerName?: string;
  jobTitle?: string;
  createdAt: Date;
}

