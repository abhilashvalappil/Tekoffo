import { MESSAGES } from "../constants/messages";
import { NotFoundError } from "../errors/customErrors";
import { INotification, INotificationRepository, INotificationService, IUserRepository } from "../interfaces";

export class NotificationService implements INotificationService {
    private userRepository: IUserRepository;
    private notificationRepository: INotificationRepository;

    constructor(userRepository: IUserRepository,notificationRepository: INotificationRepository){
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    async getNotifications(userId: string): Promise<{ notifications: INotification[] }> {
        const user  = await this.userRepository.findUserById(userId);
        if(!user){
        throw new NotFoundError(MESSAGES.UNAUTHORIZED);
        }
        const notifications = await this.notificationRepository.findNotifications(userId);
        return { notifications };
    }

    async markNotificationAsRead(userId: string,id: string): Promise<{ message: string }> {
        const user  = await this.userRepository.findUserById(userId);
        if(!user){
        throw new NotFoundError(MESSAGES.UNAUTHORIZED);
        }
        await this.notificationRepository.findNotificationById(id);
        await this.notificationRepository.updateNotification(id);
        return { message: "Notification marked as read" };
    }

    async markAllNotificationsAsRead(userId: string): Promise<{ message: string }> {
        await this.notificationRepository.updateAllNotifications(userId);
        return { message: "All Notifications are marked as read" };
    }

}