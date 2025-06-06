export interface JobDataType{
    _id:string;
    clientId: string;
    title: string;
    category: string;
    subCategory:string;
    description:string;
    requirements: string[];
    budget:number;
    duration:string;
    status: 'open' | 'inprogress' | 'completed';
    isBlocked: boolean;
    created_At?: Date;
    updated_At?: Date;
  }


  export interface Invitation {
    _id: string;
    jobId: {
      _id: string;
    } | string;
    freelancerId: {
      _id: string;
    } | string;
    clientId: string;
    proposalType: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
  }