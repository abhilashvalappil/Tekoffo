import Contract  from '../models/ContractModel';
import { CreateContractDTO, IContract, IContractRepository, status } from '../interfaces';
import BaseRepository from './BaseRepository';
import { FilterQuery, Types } from 'mongoose';


class ContractRepository extends BaseRepository<IContract>implements IContractRepository{
  constructor() {
    super(Contract);
  }

  async createContract(contract: CreateContractDTO): Promise<IContract> {
    return await this.create(contract);
  }

  async findContractById(id: string): Promise<IContract | null> {
    return await this.findById(id);
  }

  async findContractsByFreelancerId(userId: string,skip: number,limit: number,search: string,status?: string): Promise<IContract[]> {
    const query: FilterQuery<IContract> = {
      freelancerId: new Types.ObjectId(userId),
    };

    if (status && status !== 'all') {
      query.contractStatus = status;
    }

    const searchRegex = search ? new RegExp(search, "i") : undefined;
    const contracts = await this.find(query, {
      skip,
      limit,
      sort: { createdAt: -1 },
    })
      .populate({
        path: "jobId",
        match: searchRegex ? { title: searchRegex } : undefined,
        select: "title",
      })
      .populate({
        path: "clientId",
        select: "fullName",
      });
    return contracts.filter((contract) => contract.jobId !== null);      
  }

  async countContractsByFreelancerId(userId: string): Promise<number> {
    return await this.count({ freelancerId: new Types.ObjectId(userId) });
  }

  async countActiveContractsByFreelancerId(userId: string): Promise<number>{
    return await this.count({
      freelancerId: new Types.ObjectId(userId) ,
      contractStatus:'active'
    })
  }

  async countCompletedContractsByFreelancerId(userId: string): Promise<number>{
    return await this.count({
      freelancerId: new Types.ObjectId(userId) ,
      contractStatus:'completed'
    })
  }

  async countContracts(): Promise<number> {
    return await this.count();
  }

  async findContractsByClientId(userId: string,skip: number,limit: number,search?: string,status?: string): Promise<IContract[]> {
    const query: FilterQuery<IContract> = {
      clientId: new Types.ObjectId(userId),
    };
    if (status && status !== 'all') {
      query.contractStatus = status;
    }

    const searchRegex = search ? new RegExp(search, "i") : undefined;
    const contracts = await this.find(query, {
      skip,
      limit,
      sort: { createdAt: -1 },
    })
      .populate({
        path: "jobId",
        match: searchRegex ? { title: searchRegex } : undefined,
        select: "title",
      })
      .populate({
        path: "freelancerId",
        select: "fullName",
      });
    return contracts.filter((contract) => contract.jobId !== null);
  }

  async countContractsByClientId(userId: string): Promise<number> {
    return await this.count({ clientId: new Types.ObjectId(userId) });
  }

  async countActiveContractsByClientId(userId: string): Promise<number> {
    return await this.count({
      clientId: new Types.ObjectId(userId),
      contractStatus: "active",
    });
  }

  async updateContractStatus(id: string,status: status): Promise<IContract | null> {
    return await this.updateById(id, { contractStatus: status });
  }

  async getEscrowFunds(): Promise<number> {
    const result = await Contract.aggregate([
      {
        $match: {
          contractStatus: { $in: ["active", "submitted"] },
        },
      },
      {
        $project: {
          total: { $add: ["$amount", "$platFormServiceFee"] },
        },
      },
      {
        $group: {
          _id: null,
          totalEscrow: { $sum: "$total" },
        },
      },
    ]);

    return result[0]?.totalEscrow || 0;
  }
}

export default new ContractRepository();