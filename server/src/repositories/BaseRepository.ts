
import { Document, FilterQuery, Model, Query, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../interfaces";
import { UpdateResult } from "mongoose";

class BaseRepository<T extends Document> implements IBaseRepository<T> {
    private model: Model<T>;

    constructor(model:Model<T>){
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }
    async findOne(query: any): Promise<T | null> {
        return await this.model.findOne(query)
    }
    async findOneAndUpdate(query:any, updateData: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(query,updateData,{new:true})
    }
    async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
    }

    find(query: any = {}, options: { skip?: number; limit?: number; sort?: any } = {}): Query<T[], T> {
      const { skip = 0, limit = 8, sort = {} } = options;
      return this.model.find(query).skip(skip).limit(limit).sort(sort);
    }
  
    async findExec(query: any = {}, skip: number = 0, limit: number = 10): Promise<T[]> {
      return (await this.model.find(query).skip(skip).limit(limit).exec()) || [];
    }
    async count(query: any = {}): Promise<number> {
      return await this.model.countDocuments(query).exec();
    }

    async findByIdAndDelete(id:string): Promise<T | null>{
        return await this.model.findByIdAndDelete(id)
    }
   
    async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    }
    
    async updateMany( query: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateResult> {
      return await this.model.updateMany(query, update);
    }
}

export default BaseRepository;