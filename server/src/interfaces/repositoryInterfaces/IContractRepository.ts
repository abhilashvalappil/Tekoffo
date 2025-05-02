import { CreateContractDTO, IContract } from "../entities/IContract";  

export interface IContractRepository {
   createContract(contract:CreateContractDTO): Promise<IContract>
}