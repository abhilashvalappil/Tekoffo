import { CreateContractDTO, IContract, status } from "../entities/IContract";  

export interface IContractRepository {
   createContract(contract:CreateContractDTO): Promise<IContract>
   findContractById(id:string): Promise<IContract|null> 
   // findContractsByFreelancerId(userId:string): Promise<IContract[]>
   findContractsByFreelancerId(userId: string, skip: number, limit: number ,search: string,status: string,time: string): Promise<IContract[]>
   findContractsByClientId(userId:string,skip: number, limit: number,  search: string,status: string,time: string): Promise<IContract[]>
   countContracts(): Promise<number>
   updateContractStatus(id:string, status: status): Promise<IContract|null>
}