import { INotification } from "../entities/INotification";

export interface INotificationService {
    getNotifications(userId:string): Promise<{notifications:INotification[]}> 
    markNotificationAsRead(userId: string,id:string): Promise<{message:string}>
    markAllNotificationsAsRead(userId: string): Promise<{message:string}>

}