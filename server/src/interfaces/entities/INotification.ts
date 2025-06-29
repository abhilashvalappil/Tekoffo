import { Document,Types } from "mongoose";
import { NotificationType } from "../../types/notificationTypes";


export interface INotification extends Document {
  senderId: Types.ObjectId;
  recipientId: Types.ObjectId;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

 
 

