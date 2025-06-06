
import { Document, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[]; 
  lastMessage?: {
    content: string;
    senderId: Types.ObjectId;
    timestamp: Date;
    isRead: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}


export interface IChatContactPreview {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];  
  lastMessage?: {
    content: string;
    senderId: Types.ObjectId;
    timestamp: Date;
    isRead: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  unreadCount: number; 
  contact: {
    _id: Types.ObjectId;
    fullName: string;
    profilePicture: string;
    companyName?: string;
  };
}