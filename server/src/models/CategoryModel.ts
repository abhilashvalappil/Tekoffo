import mongoose, {Schema, Document} from "mongoose";
import {ICategory} from '../interfaces/entities/ICategory';

const CategorySchema: Schema = new Schema({
    catId:{
        type:String
    },
    name:{
        type:String
    },
    subCategories:{
        type: [String] 
    },
    isListed: {
        type:Boolean,
        default:true
        },
    created_At:{ 
        type: Date,
        default: Date.now
     },

})

export default mongoose.model<ICategory>('Category', CategorySchema);