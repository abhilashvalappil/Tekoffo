
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
    client:{
        _id:string;
        fullName:string;
    }
    freelancer:{
        _id:string;
        fullName:string;
    }
    job:{
        _id:string;
        title:string;
    }
    stripePaymentIntentId:string;
    transactionId:string;
    amount:number;
    contractStatus:'pending'| 'active'| 'submitted'|  'completed'| 'cancelled';
    createdAt:Date;
    completedAt?:Date;
}