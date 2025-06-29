import { PipelineStage, Types } from "mongoose";
import Proposal from "../models/ProposalModel";
import BaseRepository from "./BaseRepository";
import { IAppliedProposal, IProposal, JobInvitationView } from "../interfaces/entities/IProposal";
import { IProposalRepository } from "../interfaces/repositoryInterfaces/IProposalRepository";
import { ProposalStatus } from "../interfaces/entities/IProposal";
import { SortOption } from "../interfaces/entities/IProposal";

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

    async updateProposalStatusToRejected(proposalId: string): Promise<IProposal | null> {
        return await this.updateById(proposalId,{status: 'rejected',})
    }

    async updateProposalStatus(proposalId:string,updatedStatus:ProposalStatus): Promise<IProposal | null>{
        return await this.updateById(proposalId,{status:updatedStatus})
    }
    
    async countProposals(): Promise<number> {
        return await this.count();   
      }
    
    async countReceivedProposals(userId: string, search?: string,filters?: { status?: string; time?: string}): Promise<number> {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            clientId: new Types.ObjectId(userId),
            proposalType: 'freelancer-applied',
          },
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        { $unwind: '$job' },
        {
          $lookup: {
            from: 'users',
            localField: 'freelancerId',
            foreignField: '_id',
            as: 'freelancer',
          },
        },
        { $unwind: '$freelancer' },
      ];

      if (search) {
        const regex = new RegExp(search, 'i');
        pipeline.push({
          $match: {
            $or: [
              { 'job.title': { $regex: regex } },
              { 'job.description': { $regex: regex } },
              { 'freelancer.fullName': { $regex: regex } },
              { 'freelancer.skills': { $regex: regex } },
            ],
          },
        });
      }

       if (filters?.status) {
    pipeline.push({
      $match: { status: filters.status },
    });
  }

  if (filters?.time) {
    const now = new Date();
    let startDate: Date | null = null;

    if (filters.time === 'today') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (filters.time === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (filters.time === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    }

    if (startDate) {
      pipeline.push({
        $match: { createdAt: { $gte: startDate } },
      });
    }
  }

      pipeline.push({ $count: 'total' });

      const result = await Proposal.aggregate<{ total: number }>(pipeline);
      return result[0]?.total || 0;
  }

    async countAppliedProposals(freelancerId: string, search?: string, filter?: string): Promise<number> {
        const pipeline: PipelineStage[] = [
            {
            $match: {
                freelancerId: new Types.ObjectId(freelancerId),
                proposalType: 'freelancer-applied',
            },
            },
            {
            $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'contractDetails',
            },
            },
            { $unwind: '$contractDetails' },
        ];

        if (search) {
            const regex = new RegExp(search, 'i');
            pipeline.push({
            $match: {
                'contractDetails.title': { $regex: regex },
            },
            });
        }

        if (filter && ['pending', 'accepted', 'rejected'].includes(filter)) {
            pipeline.push({
            $match: {
                status: filter,
            },
            });
        }

        pipeline.push({ $count: 'total' });

        const result = await Proposal.aggregate(pipeline);
        return result[0]?.total || 0;
    }
    
    async findProposals(clientId:string,skip: number, limit: number,search?: string,filters?: { status?: string; time?: string}): Promise<IProposal[]> {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            clientId: new Types.ObjectId(clientId),
            proposalType: 'freelancer-applied',
          },
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        { $unwind: '$job' },
        {
          $lookup: {
            from: 'users',
            localField: 'freelancerId',
            foreignField: '_id',
            as: 'freelancer',
          },
        },
        { $unwind: '$freelancer' },
      ];

      if (search) {
        const regex = new RegExp(search, 'i');
        pipeline.push({
          $match: {
            $or: [
              { 'job.title': { $regex: regex } },
              { 'job.description': { $regex: regex } },
              { 'freelancer.fullName': { $regex: regex } },
              { 'freelancer.skills': { $regex: regex } },
            ],
          },
        });
      }

      if (filters?.status) {
    pipeline.push({
      $match: {
        status: filters.status,
      },
    });
  }

   if (filters?.time) {
    const now = new Date();
    let startDate: Date | null = null;

    if (filters.time === 'today') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (filters.time === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (filters.time === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    }

    if (startDate) {
      pipeline.push({
        $match: {
          createdAt: { $gte: startDate },
        },
      });
    }
  }

      pipeline.push(
        {
          $project: {
            _id: 1,
            proposalType:1,
            status: 1,
            coverLetter: 1,
            proposedBudget: 1,
            duration: 1,
            attachments: 1,
            createdAt: 1,
            viewed: 1,
            job: {
              _id: '$job._id',
              title: '$job.title',
              description: '$job.description',
            },
            freelancer: {
              _id: '$freelancer._id',
              fullName: '$freelancer.fullName',
              profilePicture: '$freelancer.profilePicture',
              email: '$freelancer.email',
              country: '$freelancer.country',
              description: '$freelancer.description',
              skills: '$freelancer.skills',
              preferredJobFields: '$freelancer.preferredJobFields',
              linkedinUrl: '$freelancer.linkedinUrl',
              githubUrl: '$freelancer.githubUrl',
              portfolioUrl: '$freelancer.portfolioUrl',
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      );

      return await Proposal.aggregate<IProposal>(pipeline);
    }

    async findInvitationsSent(clientId: string,search?: string,filters?: { status?: string; time?: string}): Promise<IProposal[]> {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            clientId: new Types.ObjectId(clientId),
            proposalType: 'client-invited',
          },
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        { $unwind: '$job' },
        {
          $lookup: {
            from: 'users',
            localField: 'freelancerId',
            foreignField: '_id',
            as: 'freelancer',
          },
        },
        { $unwind: '$freelancer' },
      ];

      if (search) {
        const regex = new RegExp(search, 'i');
        pipeline.push({
          $match: {
            $or: [
              { 'job.title': { $regex: regex } },
              { 'job.description': { $regex: regex } },
              { 'freelancer.fullName': { $regex: regex } },
              { 'freelancer.skills': { $regex: regex } },
            ],
          },
        });
      }

      if (filters?.status) {
        pipeline.push({
          $match: {
            status: filters.status,
          },
        });
      }

      if (filters?.time) {
        const now = new Date();
        let startDate: Date | null = null;

        if (filters.time === 'today') {
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
        } else if (filters.time === 'week') {
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
        } else if (filters.time === 'month') {
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
        }

        if (startDate) {
          pipeline.push({
            $match: {
              createdAt: { $gte: startDate },
            },
          });
        }
      }

      pipeline.push({
        $project: {
          _id: 1,
          status: 1,
          proposedBudget: 1,
          duration: 1,
          createdAt: 1,
          job: {
            _id: '$job._id',
            title: '$job.title',
            description: '$job.description',
          },
          freelancer: {
            _id: '$freelancer._id',
            fullName: '$freelancer.fullName',
            profilePicture: '$freelancer.profilePicture',
            email: '$freelancer.email',
            country: '$freelancer.country',
            description: '$freelancer.description',
            skills: '$freelancer.skills',
            preferredJobFields: '$freelancer.preferredJobFields',
            linkedinUrl: '$freelancer.linkedinUrl',
            githubUrl: '$freelancer.githubUrl',
            portfolioUrl: '$freelancer.portfolioUrl',
          },
        },
      },
      { $sort: { createdAt: -1 } },
    );

  return await Proposal.aggregate<IProposal>(pipeline);
}
    async countInvitationsSent(clientId: string, search?: string,filters?: { status?: string; time?: string}): Promise<number>{
        const pipeline: PipelineStage[] = [
      {
        $match: {
          clientId: new Types.ObjectId(clientId),
          proposalType: 'client-invited',
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },
      {
        $lookup: {
          from: 'users',
          localField: 'freelancerId',
          foreignField: '_id',
          as: 'freelancer',
        },
      },
      { $unwind: '$freelancer' },
    ];

    if (search) {
      const regex = new RegExp(search, 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'job.title': { $regex: regex } },
            { 'job.description': { $regex: regex } },
            { 'freelancer.fullName': { $regex: regex } },
            { 'freelancer.skills': { $regex: regex } },
          ],
        },
      });
    }

    if (filters?.status) {
      pipeline.push({
        $match: { status: filters.status },
      });
    }

    if (filters?.time) {
      const now = new Date();
      let startDate: Date | null = null;

      if (filters.time === 'today') {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
      } else if (filters.time === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (filters.time === 'month') {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      }

      if (startDate) {
        pipeline.push({
          $match: {
            createdAt: { $gte: startDate },
          },
        });
      }
    }

    pipeline.push({ $count: 'total' });

    const result = await Proposal.aggregate<{ total: number }>(pipeline);
    return result[0]?.total || 0;
  }

    async findJobInvitations(freelancerId: string,skip: number,limit: number,search?: string,sortBy?: SortOption): Promise<JobInvitationView[]> {
        const pipeline: PipelineStage[] = [
            {
            $match: {
                freelancerId: new Types.ObjectId(freelancerId),
                proposalType: 'client-invited',
            },
            },
            {
            $lookup: {
                from: 'users',
                localField: 'clientId',
                foreignField: '_id',
                as: 'client',
            },
            },
            { $unwind: '$client' },
            {
            $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'job',
            },
            },
            { $unwind: '$job' },
            {
            $lookup: {
                from: 'reviews',
                localField: 'clientId',
                foreignField: 'reviewedUserId',
                as: 'reviews',
            },
            },
            {
            $addFields: {
                averageRating: { $avg: '$reviews.rating' },
                totalReviews: { $size: '$reviews' },
            },
            },
        ];

        if (search) {
            const regex = new RegExp(search, 'i');
            pipeline.push({
            $match: {
                $or: [
                { 'client.fullName': { $regex: regex } },
                { 'job.title': { $regex: regex } },
                ],
            },
            });
        }

        pipeline.push({
            $project: {
            _id: 1,
            status: 1,
            proposedBudget: 1,
            duration: 1,
            client: {
                _id: '$client._id',
                fullName: '$client.fullName',
                profilePicture: '$client.profilePicture',
            },
            job: {
                _id: '$job._id',
                title: '$job.title',
            },
            averageRating: { $ifNull: ['$averageRating', 0] },
            totalReviews: 1,
            createdAt: 1,
            },
        });

        const sortMap: Record<SortOption, PipelineStage.Sort['$sort']> = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            'budget-high': { proposedBudget: -1 },
            'budget-low': { proposedBudget: 1 },
        };

        pipeline.push({ $sort: sortMap[sortBy || 'newest'] });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        return await Proposal.aggregate<JobInvitationView>(pipeline);
    }

    async countJobInvitesByFreelancer(freelancerId: string, search?: string): Promise<number> {
        const pipeline: PipelineStage[] = [
            {
            $match: {
                freelancerId: new Types.ObjectId(freelancerId),
                proposalType: 'client-invited',
            },
            },
            {
            $lookup: {
                from: 'users',
                localField: 'clientId',
                foreignField: '_id',
                as: 'client',
            },
            },
            { $unwind: '$client' },
            {
            $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'job',
            },
            },
            { $unwind: '$job' },
        ];

        if (search) {
            const regex = new RegExp(search, 'i');
            pipeline.push({
            $match: {
                $or: [
                { 'client.fullName': { $regex: regex } },
                { 'job.title': { $regex: regex } },
                ],
            },
            });
        }

        pipeline.push({
            $count: 'totalCount',
        });

        const result = await Proposal.aggregate(pipeline);
        return result[0]?.totalCount || 0;
    }

    async findAppliedProposalsByFreelancer(freelancerId: string,skip: number,limit: number,search?: string,filter?: string,): Promise<IAppliedProposal[]> {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            freelancerId: new Types.ObjectId(freelancerId),
            proposalType: 'freelancer-applied',
          },
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'jobDetails',
          },
        },
        { $unwind: '$jobDetails' },
        {
          $lookup: {
            from: 'users',
            localField: 'clientId',
            foreignField: '_id',
            as: 'clientDetails',
          },
        },
        { $unwind: '$clientDetails' },
      ];

      if (search) {
        const regex = new RegExp(search, 'i');
        pipeline.push({
          $match: {
            'jobDetails.title': { $regex: regex },
          },
        });
      }

      if (filter && ['pending', 'accepted', 'rejected'].includes(filter)) {
        pipeline.push({
          $match: {
            status: filter,
          },
        });
      }

      pipeline.push(
        {
        $project: {
          _id: 1,
          jobId: 1,
          freelancerId: 1,
          clientId: 1,
          proposalType: 1,
          status: 1,
          proposedBudget: 1,
          duration: 1,
          attachments: 1,
          viewedByReceiver: 1,
          createdAt: 1,
          updatedAt: 1,
          jobDetails: {
            jobId: '$jobDetails._id',
            title: '$jobDetails.title',
          },
          clientDetails: {
            clientId: '$clientDetails._id',
            fullName: '$clientDetails.fullName',
          },
        },
      },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      );

      return await Proposal.aggregate(pipeline);
    }


}

export default new ProposalRepository();