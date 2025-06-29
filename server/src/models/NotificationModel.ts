import mongoose, { Schema } from 'mongoose';
import { INotification } from "../interfaces";

const NotificationSchema: Schema<INotification> = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'proposal-received',
        'proposal-accepted',
        'proposal-rejected',
        'job-invitation',
        'job-invitation-accepted',
        'job-invitation-rejected',
        'job-submitted',
        'message',
        'payment-success',
        'payment-released',
        'review-received',
        'admin-alert',
      ],
    },
    message: {
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
},
{ timestamps: true }
)

export default mongoose.model<INotification>('Notification', NotificationSchema);