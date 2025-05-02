import mongoose, { Schema, Types } from 'mongoose';
import { INotification } from "../interfaces";

const NotificationSchema: Schema<INotification> = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

export default mongoose.model<INotification>('Notification', NotificationSchema);