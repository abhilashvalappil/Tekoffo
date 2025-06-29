import { ICategory,createCategoryDTO } from "../entities/ICategory";
 

export interface ICategoryRepository {
    createCategory(category:createCategoryDTO): Promise<ICategory>
    // createCategory(category:Partial<ICategory>): Promise<ICategory>;
    findCategory(category:string): Promise<ICategory | null>;
    updateCategory(category: Partial<ICategory>): Promise<ICategory | null>
    checkCategoryExistsExcludingId(id:string, name: string): Promise<ICategory | null> 
    findCategoryById(catId: string): Promise<ICategory | null>;
    findSubCategoriesMatch(subCategories: string[]): Promise<ICategory | null>
    SubCategoriesMatch(subCategories: string[], id: string): Promise<ICategory | null>
    getAllCategories(skip: number, limit: number,search?: string): Promise<ICategory[]>
    updateCategoryStatus(categorId: string, isListed: boolean): Promise<ICategory | null>;
    getListedCategories(): Promise<ICategory[]>
    countCategories(search?: string): Promise<number>
}