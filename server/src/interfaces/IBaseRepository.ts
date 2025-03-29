import { Document, Model } from "mongoose";

export interface IBaseRepository <T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findOne(query:any): Promise<T | null>;
    findOneAndUpdate(query:any, updateData: Partial<T>): Promise<T | null>;
}