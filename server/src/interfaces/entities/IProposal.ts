
import { Document,Types } from 'mongoose';

export interface IProposal extends Document {
    jobId:Types.ObjectId;
    clientId:Types.ObjectId;
    freelancerId:Types.ObjectId;
    proposedBudget:number;
    coverLetter?:string;
    duration:string;
    proposalType:'freelancer-applied' | 'client-invited';
    status:'pending' | 'accepted' | 'rejected';
    attachments?:string;
    invitationMessage?:string;
    viewedByReceiver:boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProposalInputDataType {
    proposedBudget:number;
    coverLetter?:string;
    duration:string;
    attachments?: {
        fileName: string;
      }[];
}

export interface ProposalData {
    _id:string;
    jobId:string;
    clientId:string;
    freelancerId:string;
    proposalType:string;
    status:string;
    coverLetter:string;
    proposedBudget:string;
    duration:string;
    attachments?:string;
    createdAt:string;
}