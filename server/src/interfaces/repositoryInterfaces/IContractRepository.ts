import { CreateContractDTO, IContract, status } from "../entities/IContract";  

export interface IContractRepository {
   createContract(contract:CreateContractDTO): Promise<IContract>
   findContractById(id:string): Promise<IContract|null> 
   isContractExistsByProposalId(proposalId:string): Promise<boolean>
   findContractsByFreelancerId(userId: string, skip: number, limit: number ,search?: string, status?: string): Promise<IContract[]>
   countContractsByFreelancerId(userId:string,search?: string,status?: string): Promise<number>
   countActiveContractsByFreelancerId(userId: string): Promise<number>
   countCompletedContractsByFreelancerId(userId: string): Promise<number>
   findContractsByClientId(userId:string,skip: number, limit: number,  search?: string, status?: string): Promise<IContract[]>
   countContractsByClientId(userId:string,search?: string,status?: string): Promise<number>
   countActiveContractsByClientId(userId:string): Promise<number>
   countContracts(): Promise<number>
   updateContractStatus(id:string, status: status): Promise<IContract|null>
   getEscrowFunds(): Promise<number>
}