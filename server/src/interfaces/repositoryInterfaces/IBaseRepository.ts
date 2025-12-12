import { Document, FilterQuery, UpdateQuery, UpdateResult } from "mongoose";

export interface IBaseRepository <T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findOne(query:any): Promise<T | null>;
    findOneAndUpdate(query:any, updateData: Partial<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    find(): Promise<T[]>;
    findByIdAndDelete(id:string): Promise<T | null>;
    updateById(id: string, updateData: Partial<T>): Promise<T | null>
    updateMany( query: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateResult>
}