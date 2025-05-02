import mongoose, { Document,Types } from "mongoose";

export interface INotification extends Document {
    _id:string;
    clientId:mongoose.Schema.Types.ObjectId;
    freelancerId:mongoose.Schema.Types.ObjectId;
    message: string;
    read: boolean;
    createdAt?: Date;
}

export interface CreateNotificationDTO {
    clientId:mongoose.Schema.Types.ObjectId;
    freelancerId:mongoose.Schema.Types.ObjectId;
    message: string;
}