
export interface PaymentIntentPayload {
    proposalId:string;
    freelancerId:string;
    amount:number;
    serviceFee:number;
    clientId:string;
    jobId:string;
}


//* interface for freelancer side
export interface contractResponse {
    _id:string;
    clientId:{
        _id:string;
        fullName:string;
    }
    freelancerId:{
        _id:string;
        fullName:string;
    }
    jobId:{
        _id:string;
        title:string;
    }
    stripePaymentIntentId:string;
    transactionId:string;
    amount:number;
    contractStatus:'pending'| 'active'| 'submitted'|  'completed'| 'cancelled';
    startedAt:Date;
    completedAt?:Date;
}