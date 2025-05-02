import Notification from '../models/NotificationModel';
import { INotification,INotificationRepository, CreateNotificationDTO } from '../interfaces';
import BaseRepository from './BaseRepository';
import { UpdateResult } from 'mongoose';
 


class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor(){
        super(Notification)
    }
    async createNotification(notification:CreateNotificationDTO):Promise<INotification> {
        return await this.create(notification)
    }

    async findNotifications(userId:string): Promise<INotification[]>{
        return await this.find({freelancerId:userId})
    }

    async findNotificationById(id:string): Promise<INotification | null>{
        return await this.findById(id)
    }

    async updateNotification(id:string): Promise<INotification | null> {
        return await this.updateById(id,{read:true})
    }

    async updateAllNotifications(ids: string[]): Promise<UpdateResult> {
        return await this.updateMany({ _id: { $in: ids } }, { read: true });
      }
}

export default new NotificationRepository();