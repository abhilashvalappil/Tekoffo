
 
import { PaginatedResponse } from "../../types/commonTypes";
import { ICategory } from "../entities/ICategory";
import { ITransactionWithUsername } from "../entities/ITransaction";
import { User, UserPublicInfo } from "../entities/IUser";

export interface IAdminService {
    fetchUsers(userId:string, page: number, limit: number,search?:string): Promise<PaginatedResponse<User>> 
    getTotalUsersCountByRole(userId:string): Promise<{clientsCount:number,freelancersCount:number}>
    updateUserStatus(userId: string, isBlocked: boolean): Promise<{ message: string; user: UserPublicInfo }>;
    addCategory(name:string,subCategories:string[]): Promise<{message:string}>;
    fetchCategories(userId:string, page: number, limit: number,search?:string): Promise<PaginatedResponse<ICategory>>
    updateCategoryStatus(categoryId:string, isListed:boolean): Promise<{message:string, category: Partial<ICategory>}>
    updateCategory(id:string,name:string,subCategories:string[]): Promise<{message:string}>
    getActiveJobsCount(): Promise<{count:number}>
    getPlatformRevenue(): Promise<{totalRevenue:number}>
    getPlatformEarnings(): Promise<{ month: string, earnings: number }[]>
    getEscrowFunds(): Promise<number>
    getAllTransactions(): Promise< ITransactionWithUsername[]>
}