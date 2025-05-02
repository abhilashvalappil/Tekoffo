import { Types } from "mongoose";

export interface proposalDataType {
    jobId:Types.ObjectId;
    clientId:Types.ObjectId;
    coverLetter?:string;    
    proposedBudget:number;
    duration:string;
    attachments?:Express.Multer.File;  
}