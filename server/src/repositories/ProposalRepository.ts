import { Types } from "mongoose";
import Proposal from "../models/ProposalModel";
import BaseRepository from "./BaseRepository";
import { IProposal, ProposalInputDataType } from "../interfaces/entities/IProposal";
import { IProposalRepository } from "../interfaces/repositoryInterfaces/IProposalRepository";

class ProposalRepository extends BaseRepository<IProposal> implements IProposalRepository {
    constructor(){
        super(Proposal)
    }

    async createProposal(proposalData: Partial<IProposal>): Promise<IProposal> {
        return await this.create(proposalData)
    }
    
    async findProposals(clientId:string): Promise<IProposal[]> {
        return await this.find({
            clientId:new Types.ObjectId(clientId),
            proposalType:'freelancer-applied'
        })
        .populate({
            path: 'jobId',
            select: 'title description'
        })
        .populate({
            path: 'freelancerId',
            select: 'fullName profilePicture email country description skills preferredJobFields linkedinUrl githubUrl portfolioUrl '
        })
    }
}

export default new ProposalRepository();