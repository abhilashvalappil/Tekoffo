
import { Document, Model } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

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
}

export default BaseRepository;