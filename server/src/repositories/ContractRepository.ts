import Contract  from '../models/ContractModel';
import { CreateContractDTO, IContract, IContractRepository, status } from '../interfaces';
import BaseRepository from './BaseRepository';


class ContractRepository extends BaseRepository<IContract> implements IContractRepository {
    constructor(){
        super(Contract)
    }

    async createContract(contract:CreateContractDTO): Promise<IContract> {
        return await this.create(contract)
    }

    async findContractById(id:string): Promise<IContract|null> {
        return await this.findById(id)
    }

    // async findContractsByFreelancerId(userId:string): Promise<IContract[]> {
    //     return await this.find({
    //         freelancerId:userId
    //     })
    //     .populate({
    //         path: 'jobId',
    //         select: 'title'
    //     })
    //     .populate({
    //         path: 'clientId',
    //         select: 'fullName'
    //     })
    // }
    async findContractsByFreelancerId(userId: string, skip: number, limit: number ,search: string,status: string,time: string): Promise<IContract[]> {
        const regexSearch = new RegExp(search, 'i'); // case-insensitive
        const query: any = { freelancerId: userId };

        if (status !== 'all') {
            query.contractStatus = status;
          }
        
          // Apply time filter
          if (time !== 'all') {
            const today = new Date();
            if (time === 'month') {
              const monthAgo = new Date();
              monthAgo.setMonth(today.getMonth() - 1);
              query.startedAt = { $gte: monthAgo };
            } else if (time === 'year') {
              const yearAgo = new Date();
              yearAgo.setFullYear(today.getFullYear() - 1);
              query.startedAt = { $gte: yearAgo };
            }
          }
    
        let contracts = await this.find(query,{ skip, limit, sort: { createdAt: -1 } })
        .populate({
            path: 'jobId',
            match: { title: { $regex: regexSearch } },
            select: 'title',
        })
        .populate({
            path: 'clientId',
            select: 'fullName',
        });
    
        contracts = contracts.filter(c => c.jobId);
        // console.log('Filtered Contracts (matching job title):', contracts); // After filtering
    
        return contracts;
    }

    async countContracts(): Promise<number> {
        return await this.count();   
      }
    

    async findContractsByClientId(userId:string,skip: number, limit: number ,search: string,status: string,time: string): Promise<IContract[]> {
        // return await this.find({clientId:userId})
        const regexSearch = new RegExp(search, 'i'); // case-insensitive
        const query: any = { clientId: userId };

        if (status !== 'all') {
            query.contractStatus = status;
          }
        
          // Apply time filter
          if (time !== 'all') {
            const today = new Date();
            if (time === 'month') {
              const monthAgo = new Date();
              monthAgo.setMonth(today.getMonth() - 1);
              query.startedAt = { $gte: monthAgo };
            } else if (time === 'year') {
              const yearAgo = new Date();
              yearAgo.setFullYear(today.getFullYear() - 1);
              query.startedAt = { $gte: yearAgo };
            }
          }
    
        let contracts = await this.find(query,{ skip, limit, sort: { createdAt: -1 } })
        .populate({
            path: 'jobId',
            match: { title: { $regex: regexSearch } },
            select: 'title',
        })
        .populate({
            path: 'freelancerId',
            select: 'fullName',
        });

        
    
        contracts = contracts.filter(c => c.jobId);
        // console.log('Filtered Contracts (matching job title):', contracts); // After filtering
    
        return contracts;
    }

    async updateContractStatus(id:string, status: status): Promise<IContract|null> {
        return await this.updateById(id,{contractStatus:status})
    }
}

export default new ContractRepository();