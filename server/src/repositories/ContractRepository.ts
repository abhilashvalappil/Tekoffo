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
}

export default new ContractRepository();