import mongoose,{Document,Types} from "mongoose";

export interface IMessage extends Document {
    roomId: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text: string;
    isRead: boolean;
    timestamp: Date;
    createdAt?: Date;
    updatedAt?: Date;
}