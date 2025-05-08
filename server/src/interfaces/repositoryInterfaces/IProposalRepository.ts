import { IProposal } from "../entities/IProposal";

export interface IProposalRepository {
    createProposal(proposalData: Partial<IProposal>): Promise<IProposal>
    findProposalById(proposalId:string): Promise<IProposal | null> 
    findProposalDetails(proposalId: string): Promise<IProposal | null>
    updateProposalStatusToAccepted(proposalId:string): Promise<IProposal | null>
    countProposals(): Promise<number>
    findProposals(clientId:string,skip: number, limit: number): Promise<IProposal[]>
    findAppliedProposalsByFreelancer(freelancerId:string,skip: number, limit: number): Promise<IProposal[]>
}