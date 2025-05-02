import { CreateContractDTO, IContract } from "../entities/IContract";  

export interface IContractRepository {
   createContract(contract:CreateContractDTO): Promise<IContract>
   findContractsByFreelancerId(userId:string): Promise<IContract[]>
   findContractsByClientId(userId:string): Promise<IContract[]>
}