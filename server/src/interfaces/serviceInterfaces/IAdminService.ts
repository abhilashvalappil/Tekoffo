
 
import { PaginatedResponse } from "../../types/commonTypes";
import { ICategory } from "../entities/ICategory";
import { FetchUserResponse, IUser, IUserResponse } from "../entities/IUser";

export interface IAdminService {
    // fetchUsers(userId:string): Promise<{ users: IUserResponse[]; totalCount: number }>;
    fetchUsers(userId:string, page: number, limit: number): Promise<{
                data:FetchUserResponse;
                meta: { total: number; page: number; pages: number; limit: number };
            }>
    updateUserStatus(userId: string, isBlocked: boolean): Promise<{ message: string; user: any }>;
    addCategory(catId:string,name:string,subCategories?:string[]): Promise<{message:string}>;
    // fetchCategories(): Promise<{categories: ICategory[]}>
    fetchCategories(userId:string, page: number, limit: number): Promise<PaginatedResponse<ICategory>>
    updateCategoryStatus(categoryId:string, isListed:boolean): Promise<{message:string, category: Partial<ICategory>}>
    updateCategory(id:string, catId:string,name:string,subCategories?:string[]): Promise<{message:string}>
     
}