import mongoose,{Schema, Types} from "mongoose";
import { IMessage } from "../interfaces";

const MessageSchema = new Schema({
    roomId:{
        type:String,
        required:true
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
    },
    isRead:{
        type:Boolean,
        default:false
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true,
  }
)

export default mongoose.model<IMessage>('Message', MessageSchema);