import { CreateContractDTO, IContract, status } from "../entities/IContract";  

export interface IContractRepository {
   createContract(contract:CreateContractDTO): Promise<IContract>
   findContractById(id:string): Promise<IContract|null> 
   findContractsByFreelancerId(userId:string): Promise<IContract[]>
   findContractsByClientId(userId:string): Promise<IContract[]>
   updateContractStatus(id:string, status: status): Promise<IContract|null>
}