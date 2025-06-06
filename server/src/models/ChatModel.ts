import mongoose,{Schema, Types} from "mongoose";
import { IChat } from "../interfaces";

const ChatSchema : Schema<IChat> = new Schema({
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    ],
     lastMessage: {
      content: String,
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date,
      isRead: Boolean
    }
},{
    timestamps: true,
  }
)

export default mongoose.model<IChat>('Chat', ChatSchema);