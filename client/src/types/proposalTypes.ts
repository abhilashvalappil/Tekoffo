
export interface proposalDataType {
    jobId:string;
    clientId:string;
    coverLetter?:string;
    proposedBudget:number;
    duration:string;
    attachments?:string;

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
    attachments:string;
    createdAt:string;
}