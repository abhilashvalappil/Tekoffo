import { IProposal } from "../entities/IProposal";

export interface IProposalRepository {
    createProposal(proposalData: Partial<IProposal>): Promise<IProposal>
    findProposals(clientId:string): Promise<IProposal[]>
}