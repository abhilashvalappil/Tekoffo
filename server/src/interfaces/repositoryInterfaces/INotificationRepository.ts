
import { UpdateResult } from "mongoose";
// import { CreateNotificationDTO } from "../entities/INotification";
import { INotification } from "../entities/INotification";

export interface INotificationRepository {
   createNotification(notification:Partial<INotification>):Promise<INotification>
   findNotifications(userId:string): Promise<INotification[]>
   findNotificationById(id:string): Promise<INotification | null>
   updateNotification(id:string): Promise<INotification | null>
   updateAllNotifications(userId: string): Promise<UpdateResult> 
}