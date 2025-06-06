import mongoose,{Document,Types} from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    mediaUrl: string;
    isRead: boolean;
    isDeleted: boolean;
    timestamp: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MessagePayload {
  chatId: string;
  receiverId: string;
  content?: string;
  mediaUrl?:string;
}

export interface ChatContactPreview {
  userId: string;
  fullName: string;
  profilePicture: string;
  companyName: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
}
