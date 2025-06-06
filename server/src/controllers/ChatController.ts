import { Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import dotenv from "dotenv";
import { error } from "console";
import { IChatService } from "../interfaces";
 
 

interface AuthRequest extends Request {
    userId?: string;  
  }

export class ChatController {
    private chatService: IChatService;

    constructor(chatService: IChatService){
        this.chatService = chatService;
    }

    async getChat(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const { senderId, receiverId } = req.body;
            const {chat} = await this.chatService.getChat(senderId,receiverId)
            res.status(Http_Status.OK).json({chat})
        } catch (error) {
            next(error)
        }
    }

    async createChat(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            console.log('console from createChat',req.body)
            const { senderId, receiverId } = req.body;
            await this.chatService.createChat(senderId,receiverId)
        } catch (error) {
            next(error)
        }
    }

    async createMessage(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.UNAUTHORIZED).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            console.log('console from createmsg controllerrrrrrrr &&^%########&&&&&',req.body)
            console.log('req.file:', req.file);
            const mediaUrl = req.file ? req.file.path : undefined;
            const messageData = {
                ...req.body,
                mediaUrl,
            }
            const {message} = await this.chatService.createMessage(userId, messageData)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

    async getChatContacts(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.UNAUTHORIZED).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {contacts} = await this.chatService.getChatContacts(userId)
            // console.log('console from chatcontroller getChatContacts ',contacts)
            res.status(Http_Status.OK).json({contacts})
        } catch (error) {
            next(error)
        }
    }

    async getMessagesByChat(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const {chatId} = req.query;
            if(typeof chatId !== 'string'){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.CHAT_NOT_FOUND})
                return;
            }
            const {messages} = await this.chatService.getMessagesByChat(chatId)
            res.status(Http_Status.OK).json({messages})
        } catch (error) {
            next(error)
        }
    }

    async markMessagesAsRead(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {chatId} = req.body;
            await this.chatService.markMessagesAsRead(userId,chatId)
        } catch (error) {
            next(error)
        }
    }

    async getUserUnreadChatsCount(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const {count} = await this.chatService.getUserUnreadChatsCount(userId)
            res.status(Http_Status.OK).json({count})
        } catch (error) {
            next(error)
        }
    }

    async deleteMessage(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }
            const messageId = req.body.messageId;
            const {message} = await this.chatService.deleteMessage(userId,messageId)
            res.status(Http_Status.OK).json({message})
        } catch (error) {
            next(error)
        }
    }

}