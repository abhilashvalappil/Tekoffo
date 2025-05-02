import Contract  from '../models/ContractModel';
import { CreateContractDTO, IContract, IContractRepository } from '../interfaces';
import BaseRepository from './BaseRepository';


class ContractRepository extends BaseRepository<IContract> implements IContractRepository {
    constructor(){
        super(Contract)
    }

    async createContract(contract:CreateContractDTO): Promise<IContract> {
        return await this.create(contract)
    }

    async findContractsByFreelancerId(userId:string): Promise<IContract[]> {
        return await this.find({
            freelancerId:userId
        })
        .populate({
            path: 'jobId',
            select: 'title'
        })
        .populate({
            path: 'clientId',
            select: 'fullName'
        })
    }

    async findContractsByClientId(userId:string): Promise<IContract[]> {
        return await this.find({clientId:userId})
    }
}

export default new ContractRepository();