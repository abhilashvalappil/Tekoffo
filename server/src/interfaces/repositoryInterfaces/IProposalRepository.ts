import { IAppliedProposal, IProposal, JobInvitationView, ProposalStatus } from "../entities/IProposal";
type SortOption = 'newest' | 'oldest' | 'budget-high' | 'budget-low';
export interface IProposalRepository {
    createProposal(proposalData: Partial<IProposal>): Promise<IProposal>
    findProposalById(proposalId:string): Promise<IProposal | null> 
    findProposalDetails(proposalId: string): Promise<IProposal | null>
    updateProposalStatusToAccepted(proposalId:string): Promise<IProposal | null>
    updateProposalStatusToRejected(proposalId: string): Promise<IProposal | null>
    updateProposalStatus(proposalId:string,updatedStatus:ProposalStatus): Promise<IProposal | null>
    countProposals(): Promise<number>
    countReceivedProposals(userId:string, search?: string,filters?: { status?: string; time?: string}): Promise<number>
    countAppliedProposals(freelancerId:string, search?: string, filter?: string): Promise<number>
    findProposals(clientId:string,skip: number, limit: number, search?: string,filters?: { status?: string; time?: string}): Promise<IProposal[]>
    findInvitationsSent(clientId:string,search?: string,filters?: { status?: string; time?: string}): Promise<IProposal[]>
    countInvitationsSent(clientId: string, search?: string,filters?: { status?: string; time?: string}): Promise<number>
    findJobInvitations(freelancerId:string,skip: number, limit: number, search?: string,sortBy?: SortOption): Promise<JobInvitationView[]>
    countJobInvitesByFreelancer(freelancerId:string, search?: string): Promise<number>
    findAppliedProposalsByFreelancer(freelancerId:string,skip: number, limit: number, search?: string, filter?: string): Promise<IAppliedProposal[]>
}