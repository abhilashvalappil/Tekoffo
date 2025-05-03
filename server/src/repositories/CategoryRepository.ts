import Category from '../models/CategoryModel';
import { ICategory, ICategoryRepository,createCategoryDTO } from '../interfaces';
import BaseRepository from './BaseRepository';
import {  } from '../interfaces';


class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor(){
        super(Category)
    }
    async createCategory(category:createCategoryDTO): Promise<ICategory> {
        return await this.create(category)
    }
    async findCategory(name:string): Promise<ICategory | null> {
        return await this.findOne({name:{ $regex: new RegExp(`^${name}$`, 'i')}})
    }

    async findSubCategoriesMatch(subCategories: string[]): Promise<ICategory | null> {
      const regexes = subCategories.map(
        (item) => new RegExp(`^${item}$`, 'i')  
      );
      return await this.findOne({
          subCategories: { $in: regexes }
      });
  }


  async updateCategory(category: Partial<ICategory>): Promise<ICategory | null> {
    const { _id, ...updateData } = category;
    return await this.updateById(_id!, updateData);  
  }

  async checkCategoryExistsExcludingId(id:string,name: string): Promise<ICategory | null> {
    return await this.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id } 
    });
  }

  async SubCategoriesMatch(subCategories: string[], id: string): Promise<ICategory | null> {
    const regexes = subCategories.map(
      (item) => new RegExp(`^${item}$`, 'i')  
    );
    return await this.findOne({
        _id: { $ne: id},
        subCategories: { $in: regexes }
    });
  }

  

    // async findCategoryById(id:string): Promise<ICategory | null> {
    //   return await this.findById(id)
    // }

    // async updateCategory(category: Partial<ICategory>): Promise<ICategory | null> {
    //   const { catId, ...updateData } = category;
    //   return await this.findOneAndUpdate({ catId }, updateData); 
    // }

    async findCategoryById(categoryId: string): Promise<ICategory | null> {
        return await this.findById(categoryId);
      }
      

   
    // async findSubCategoriesMatch(subCategories: string[]): Promise<ICategory | null> {
    //     return await this.findOne({ subCategories: subCategories });
    //   }
  

    async getAllCategories(skip: number, limit: number): Promise<ICategory[]> {
        // return await this.find({}, skip, limit, { createdAt: -1 }) || [];  
        return await this.find({}, { skip, limit, sort: { createdAt: -1 } }) || [];  
      }

      async countCategories(): Promise<number> {
        return await this.count();   
      }
      

    async updateCategoryStatus(categorId: string, isListed: boolean): Promise<ICategory | null> {
        return await this.updateById(categorId, { isListed } as Partial<ICategory>);
    }
    async getListedCategories(): Promise<ICategory[]> {
        return (await this.find({ isListed: true })) || [];
      }
    
}

export default new CategoryRepository();