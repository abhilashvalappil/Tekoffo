
 
import { ICategory } from "../entities/ICategory";
import { IUser, IUserResponse } from "../entities/IUser";

export interface IAdminService {
    fetchUsers(userId:string): Promise<{ users: IUserResponse[]; totalCount: number }>;
    updateUserStatus(userId: string, isBlocked: boolean): Promise<{ message: string; user: any }>;
    addCategory(catId:string,name:string,subCategories?:string[]): Promise<{message:string}>;
    // fetchCategories(): Promise<{categories: ICategory[]}>
      fetchCategories(userId:string,page = 1, limit = 10)
    updateCategoryStatus(categoryId:string, isListed:boolean): Promise<{message:string, category: Partial<ICategory>}>
    updateCategory(id:string, catId:string,name:string,subCategories?:string[]): Promise<{message:string}>
     
}