import {  Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";
import { INotificationService } from "../interfaces";

interface AuthRequest extends Request {
  userId?: string;
}

export class NotificationController {
    private notificationService: INotificationService;

    constructor(notificationService: INotificationService){
        this.notificationService = notificationService;
    }

    async getNotifications(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
        try {
        const userId = req.userId;
        if (!userId) {
            res.status(Http_Status.FORBIDDEN).json({ error: MESSAGES.UNAUTHORIZED });
            return;
        }
        const {notifications}  = await this.notificationService.getNotifications(userId);
        res.status(Http_Status.OK).json({notifications});
        } catch (error) {
        next(error);
        }
    }

    async markNotificationAsRead(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
        try {
        const userId = req.userId;
        if (!userId) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
            return;
        }
        const { id } = req.params;
        await this.notificationService.markNotificationAsRead(userId,id);
        } catch (error) {
        next(error);
        }
    }

    async markAllNotificationsAsRead(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
        try {
        const userId = req.userId;
        if (!userId) {
            res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.UNAUTHORIZED });
            return;
        }
        await this.notificationService.markAllNotificationsAsRead(userId);
        } catch (error) {
        next(error);
        }
    }

}