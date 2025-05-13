import mongoose,{Schema,Types} from "mongoose";
import { IGig } from "../interfaces";

const GigSchema : Schema<IGig> = new Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    revisions: {
        type: Number,
        required: true
    },
    deliveryTime:{
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    requirements:{
        type: [String],
        default: []
    },
    freelancerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
},{
     timestamps: true 
 }
)

export default mongoose.model<IGig>('Gig', GigSchema);