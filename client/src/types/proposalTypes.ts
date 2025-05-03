
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
    jobId: {
        _id: string;
        title: string;
        description: string;
      };    
    clientId:{
        _id: string;
        fullName: string;
    };
    freelancerId: {
        _id: string;
        fullName: string;
        email:string;
        profilePicture?:string;
        country:string;
        description:string;
        skills:string[];
        preferredJobFields:string[];
        linkedinUrl?:string;
        githubUrl?:string;
        portfolioUrl:string;
      };
    proposalType:string;
    status:string;
    coverLetter:string;
    proposedBudget:number;
    duration:string;
    attachments:string;
    createdAt:string;
}


export interface AppliedProposal {
  _id: string;
  jobId: {
    _id: string;
    title: string;
  };
  clientId: {
    _id: string;
    fullName: string;
  };
  proposedBudget: number;
  duration: string;
  status: 'accepted' | 'rejected' | 'pending';
  createdAt: string;
}
