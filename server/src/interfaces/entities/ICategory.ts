import mongoose, {Schema, Document} from "mongoose";

export interface ICategory extends Document {
    _id:string;
    catId:string;
    name:string;
    subCategories:string[];
    isListed:Boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

