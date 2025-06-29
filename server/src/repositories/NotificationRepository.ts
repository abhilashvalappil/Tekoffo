import Notification from '../models/NotificationModel';
import { INotification,INotificationRepository } from '../interfaces';
import BaseRepository from './BaseRepository';
import { UpdateResult } from 'mongoose';
 
class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor(){
        super(Notification)
    }
    async createNotification(notification:Partial<INotification>):Promise<INotification> {
        return await this.create(notification)
    }

    async findNotifications(userId:string): Promise<INotification[]>{
        return await this.find({recipientId:userId}).sort({ createdAt: -1 })
    }

    async findNotificationById(id:string): Promise<INotification | null>{
        return await this.findById(id)
    }

    async updateNotification(id:string): Promise<INotification | null> {
        return await this.updateById(id,{isRead:true})
    }

    async updateAllNotifications(userId: string): Promise<UpdateResult> {
        return await this.updateMany({recipientId:userId}, { isRead: true });
      }
}

export default new NotificationRepository();