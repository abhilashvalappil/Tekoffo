import Category from '../models/CategoryModel';
import { ICategory, ICategoryRepository,createCategoryDTO } from '../interfaces';
import BaseRepository from './BaseRepository';
import {  } from '../interfaces';
import { FilterQuery } from 'mongoose';


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

    async findCategoryById(categoryId: string): Promise<ICategory | null> {
        return await this.findById(categoryId);
      }

    async getAllCategories(skip: number, limit: number,search?: string): Promise<ICategory[]> {
        const query: FilterQuery<ICategory> = {};
        if(search && search.trim()){
           const searchRegex = new RegExp(search,'i');
           query.$or = [
            {name: searchRegex},
            {subCategories: searchRegex}
          ]
        }
        return await this.find(query, { skip, limit, sort: { createdAt: -1 } }) || [];  
      }

      async countCategories(search?: string): Promise<number> {
        const query: FilterQuery<ICategory> = {};
        if (search && search.trim()) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [
            { name: searchRegex },
            { subCategories: searchRegex },  
          ];
        }
        return await this.count(query);  
      }
      

    async updateCategoryStatus(categorId: string, isListed: boolean): Promise<ICategory | null> {
        return await this.updateById(categorId, { isListed } as Partial<ICategory>);
    }
    async getListedCategories(): Promise<ICategory[]> {
        return (await this.find({ isListed: true })) || [];
      }
    
}

export default new CategoryRepository();