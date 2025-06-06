import mongoose,{Schema, Types} from "mongoose";
import { IMessage } from "../interfaces";

const MessageSchema : Schema<IMessage> = new Schema({
    chatId:{
        type:Schema.Types.ObjectId,
        ref:'Chat',
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
    content:{
        type:String,
    },
    mediaUrl:{
        type:String,
    },
    isRead:{
        type:Boolean,
        default:false
    },
    isDeleted:{
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