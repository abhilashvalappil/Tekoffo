
import { Document,Types } from 'mongoose';

export interface IProposal extends Document {
    jobId:Types.ObjectId;
    clientId:Types.ObjectId;
    freelancerId:Types.ObjectId;
    proposedBudget:number;
    coverLetter?:string;
    duration:string;
    proposalType:'freelancer-applied' | 'client-invited';
    status:'invited'|'pending' | 'accepted' | 'rejected';
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

export interface JobInvitationView {
  _id:string;
  status: 'invited' |'pending' | 'accepted' | 'rejected';
  proposedBudget: number;
  duration: string;
  client: {
    _id: string;  
    fullName: string;
    profilePicture?: string;
  };
  job: {
    _id: string;  
    title: string;
  };
  averageRating: number;
  totalReviews: number;
}
export type SortOption = 'newest' | 'oldest' | 'budget-high' | 'budget-low';

 
export enum ProposalStatus {
  INVITED = 'invited',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}


export interface IAppliedProposal{
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  clientId: Types.ObjectId;
  proposalType: string;
  status: string;
  proposedBudget: number;
  duration: string;
  attachments: string;
  viewedByReceiver: boolean;
  createdAt: Date;
  updatedAt: Date;
  jobDetails: {
    jobId: Types.ObjectId;
    title: string;
  };
  clientDetails: {
    clientId:Types. ObjectId;
    fullName: string;
  };
}
