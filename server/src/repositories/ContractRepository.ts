import Contract  from '../models/ContractModel';
import { CreateContractDTO, IContract, IContractRepository, status } from '../interfaces';
import BaseRepository from './BaseRepository';
import { Types } from 'mongoose';
import { PipelineStage } from 'mongoose';


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

  async findContractsByFreelancerId(userId: string,skip: number,limit: number,search?: string,status?: string): Promise<IContract[]>{
    const pipeline: PipelineStage[] = [
    {
      $match: {
        freelancerId: new Types.ObjectId(userId),
        ...(status && status !== 'all' && { contractStatus: status }),
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
    {
      $unwind: '$job',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'clientId',
        foreignField: '_id',
        as: 'client',
      },
    },
    {
      $unwind: '$client',
    },
  ];

  if (search && search.trim()) {
    const regex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        'job.title': { $regex: regex },
      },
    });
  }

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        freelancerId: 1,
        clientId: '$client._id',
        contractStatus: 1,
        amount: 1,
        createdAt: 1,
        jobId: '$job._id',
        job: {
          title: '$job.title',
        },
        client: {
          _id:'$client._id',
          fullName: '$client.fullName',
        },
      },
    }
  );

  return await Contract.aggregate<IContract>(pipeline);
  } 

  async countContractsByFreelancerId(userId: string,search?: string,status?: string): Promise<number> {
      const pipeline: PipelineStage[] = [
      {
        $match: {
          freelancerId: new Types.ObjectId(userId),
        },
      },
    ];

    if (status && status !== 'all') {
      pipeline.push({
        $match: { contractStatus: status },
      });
    }

    if (search && search.trim()) {
      const regex = new RegExp(search, 'i');
      pipeline.push(
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        {
          $unwind: '$job',
        },
        {
          $match: {
            'job.title': { $regex: regex },
          },
        }
      );
    }

    pipeline.push({
      $count: 'total',
    });

    const result = await Contract.aggregate(pipeline);
    return result[0]?.total || 0;
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

  async findContractsByClientId(userId: string,skip: number,limit: number,search?: string,status?: string): Promise<IContract[]>{
     const pipeline: PipelineStage[] = [
    {
      $match: {
        clientId: new Types.ObjectId(userId),
        ...(status && status !== 'all' && { contractStatus: status }),
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

  if (search && search.trim()) {
    const regex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        'job.title': { $regex: regex },
      },
    });
  }

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        clientId: 1,
        stripePaymentIntentId: 1,
        transactionId: 1,
        contractStatus: 1,
        amount: 1,
        createdAt: 1,
        job: {
          _id: '$job._id',
          title: '$job.title',
        },
        freelancer: {
          _id: '$freelancer._id',
          fullName: '$freelancer.fullName',
        },
      },
    }
  );

  return await Contract.aggregate<IContract>(pipeline);
  }

  async countContractsByClientId(userId:string,search?:string,status?:string): Promise<number> {
      const pipeline: PipelineStage[] = [
      {
        $match: {
          clientId: new Types.ObjectId(userId),
          ...(status && status !== 'all' && { contractStatus: status }),
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
    ];

    if (search && search.trim()) {
      const regex = new RegExp(search, 'i');
      pipeline.push({
        $match: {
          'job.title': { $regex: regex },
        },
      });
    }

    pipeline.push({
      $count: 'total',
    });

    const result = await Contract.aggregate(pipeline);
    return result[0]?.total || 0;
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