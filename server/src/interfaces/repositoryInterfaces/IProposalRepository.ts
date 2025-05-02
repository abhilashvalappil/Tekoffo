import { IProposal } from "../entities/IProposal";

export interface IProposalRepository {
    createProposal(proposalData: Partial<IProposal>): Promise<IProposal>
    findProposalById(proposalId:string): Promise<IProposal | null> 
    findProposalDetails(proposalId: string): Promise<IProposal | null>
    updateProposalStatusToAccepted(proposalId:string): Promise<IProposal | null>
    findProposals(clientId:string): Promise<IProposal[]>
    findAppliedProposalsByFreelancer(freelancerId:string): Promise<IProposal[]>
}