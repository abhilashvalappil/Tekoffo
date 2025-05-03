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
    // findSubCategoriesMatch(subcategories: string[]): Promise<ICategory | null>;
    // getAllCategories(): Promise<ICategory[]>
    getAllCategories(skip: number, limit: number): Promise<ICategory[]>
    updateCategoryStatus(categorId: string, isListed: boolean): Promise<ICategory | null>;
    getListedCategories(): Promise<ICategory[]>
    countCategories(): Promise<number>
}