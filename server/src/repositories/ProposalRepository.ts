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
    async findProposalById(proposalId:string): Promise<IProposal | null> {
        return await this.findById(proposalId)
    }

    async findProposalDetails(proposalId: string): Promise<IProposal | null> {
        const proposalDetails = await this.findById(proposalId);
        if (proposalDetails) {
            return await proposalDetails.populate([
                {
                    path: 'jobId',
                    select: 'title description',
                },
                {
                    path: 'freelancerId',
                    select: 'fullName',
                },
                {
                    path: 'clientId',
                    select: 'fullName',
                },
            ]);
        }
        return null;  
    }
    
    async updateProposalStatusToAccepted(proposalId: string): Promise<IProposal | null> {
        const updatedProposal = await this.updateById(
            proposalId,
            {
                status: 'accepted',
                updatedAt: new Date()
            }
        );
    
        if (!updatedProposal) return null;
    
        return await updatedProposal.populate([
            {
                path: 'jobId',
                select: 'title description',
            },
            {
                path: 'freelancerId',
                select: 'fullName',
            }
        ]);
    }
    
    async countProposals(): Promise<number> {
        return await this.count();   
      }
    
    async findProposals(clientId:string,skip: number, limit: number): Promise<IProposal[]> {
        return await this.find({
            clientId:new Types.ObjectId(clientId),
            proposalType:'freelancer-applied'
        },{ skip, limit, sort: { createdAt: -1 } })
        .populate({
            path: 'jobId',
            select: 'title description'
        })
        .populate({
            path: 'freelancerId',
            select: 'fullName profilePicture email country description skills preferredJobFields linkedinUrl githubUrl portfolioUrl '
        })
    }

    async findAppliedProposalsByFreelancer(freelancerId:string,skip: number, limit: number): Promise<IProposal[]> {
        return await this.find({
            freelancerId:new Types.ObjectId(freelancerId),
            proposalType:'freelancer-applied'
        },{ skip, limit, sort: { createdAt: -1 } })
        .populate({
            path: 'jobId',
            select: 'title'
        })
        .populate({
            path: 'clientId',
            select: 'fullName'
        })
    }

     
}

export default new ProposalRepository();