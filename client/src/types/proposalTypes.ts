
export interface proposalDataType {
    jobId:string;
    clientId:string;
    coverLetter?:string;
    proposedBudget:number;
    duration:string;
    attachments?:string;

}

export interface Proposal{
  id: string;
  _id: string;
  jobId: {
    _id: string;
    title: string;
    description: string;
  };
  freelancerId: {
    _id: string;
    fullName: string;
    email: string;
  };
  title: string;
  sender: string;
  receiver: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  viewed?: boolean;
  proposedBudget: number;
  amount: number;
  description: string;
  duration?: string;
  attachments?:string;
  senderEmail?: string;
  senderProfilePicture?: string;
  senderCountry?: string;
  senderDescription?: string;
  senderSkills?: string[];
  senderPreferredJobFields?: string[];
  senderLinkedinUrl?: string;
  senderGithubUrl?: string;
  senderPortfolioUrl?: string;
};

export interface Profile {
  name: string;
  email: string;
  country: string;
  description: string;
  profilePicture: string;
  skills: string[];
  preferredJobFields: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};

export interface ProposalData {
    _id:string;
     proposalType:string;
    status:string;
    coverLetter:string;
    proposedBudget:number;
    duration:string;
    attachments?:string;
    createdAt:string;
    viewed?:boolean;
    job: {
        _id: string;
        title: string;
        description: string;
      };    
    clientId:{
        _id: string;
        fullName: string;
    };
    freelancer: {
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
        portfolioUrl?:string;
      };
}

export interface ReceivedProposalsDTO {
    _id:string;
     proposalType:string;
    status:string;
    coverLetter:string;
    proposedBudget:number;
    duration:string;
    attachments?:string;
    createdAt:Date;
    jobId: {
        _id: string;
        title: string;
        description: string;
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
        portfolioUrl?:string;
      };
}

export interface JobInvitationView {
   _id:string;
  status: 'invited' |'pending' | 'accepted' | 'rejected';
  proposedBudget: number;
  duration: string;
  client: {
    _id: string; // or Types.ObjectId if you’re working with ObjectId
    fullName: string;
    profilePicture?: string;
  };
  job: {
    _id: string; // or Types.ObjectId
    title: string;
  };
  averageRating: number;
  totalReviews: number;
}


export interface AppliedProposal {
   _id: string;               // ObjectId as string
  jobId: string;
  freelancerId: string;
  clientId: string;
  proposalType: string;
  status: 'accepted' | 'rejected' | 'pending';
  proposedBudget: number;
  duration: string;
  attachments: string;
  viewedByReceiver: boolean;
  createdAt: string;         // Date as ISO string
  updatedAt: string;         // Date as ISO string

  jobDetails: {
    jobId: string;           // ObjectId as string
    title: string;
  };

  clientDetails: {
    clientId: string;        // ObjectId as string
    fullName: string;
  };
}


export type ProposalFilters = {
  status?: string;
  time?: string;
};