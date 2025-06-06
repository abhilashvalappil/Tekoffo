import { Types } from "mongoose";
import { ChatContactPreview, IMessageRepository, IChatService, IUserRepository, MessagePayload, IChatRepository, IChat, IChatContactPreview, IMessage } from "../interfaces";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { MESSAGES } from "../constants/messages";


export class ChatService implements IChatService{
    private chatRepository:IChatRepository;
    private messageRepository:IMessageRepository;
    private userRepository: IUserRepository;
    
    constructor(chatRepository:IChatRepository,messageRepository:IMessageRepository, userRepository: IUserRepository, ){
         this.chatRepository = chatRepository;
         this.messageRepository = messageRepository;
         this.userRepository = userRepository;
    }

    async getChat(senderId:string,receiverId:string): Promise<{chat:IChat | null}>{
        const receiverExist = await this.userRepository.findUserById(senderId);
        if(!receiverExist){
            throw new NotFoundError(MESSAGES.INVALID_USER);
        }
        const chat = await this.chatRepository.findChat(senderId,receiverId)
        return{chat}
    }

    async createChat(senderId:string,receiverId:string): Promise<{chat:IChat}> {
        const senderExist = await this.userRepository.findUserById(senderId);
        const receiverExist = await this.userRepository.findUserById(receiverId)
         if(!senderExist || !receiverExist){
            throw new NotFoundError(MESSAGES.INVALID_USER);
        }
        const chat = await this.chatRepository.createChat(senderId,receiverId)
        return{chat}
    }

    async createMessage(userId:string,messageData: MessagePayload): Promise<{message:IMessage}> {
         const msgData = {
            content:messageData.content,
            mediaUrl: messageData.mediaUrl, 
            senderId: new Types.ObjectId(userId),
            chatId: new Types.ObjectId(messageData.chatId),
            receiverId: new Types.ObjectId(messageData.receiverId),
            timestamp: new Date(),
        };
        const message = await this.messageRepository.createMessage(msgData)
        return {message}
    }

    async getChatContacts(userId:string): Promise<{contacts:IChatContactPreview[]}> {
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const contacts = await this.chatRepository.getChatContactsByUserId(userId)
        return {contacts}
    }

    async getMessagesByChat(chatId:string): Promise<{messages:IMessage[]}> {
        const chatExist = await this.chatRepository.findChatById(chatId)
        if(!chatExist){
            throw new NotFoundError(MESSAGES.CHAT_NOT_FOUND)
        }
        const messages = await this.messageRepository.findMessagesByChatId(chatId)
        return{messages}
    }

    async markMessagesAsRead(userId:string,chatId:string): Promise<void> {
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const chatExist = await this.chatRepository.findChatById(chatId)
        if(!chatExist){
            throw new NotFoundError(MESSAGES.CHAT_NOT_FOUND)
        }
        await this.messageRepository.updateMessageReadStatus(userId,chatId)
    }

    async getUserUnreadChatsCount(userId:string): Promise<{count:number}>{
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const count = await this.messageRepository.countUserUnreadChats(userId)
        return {count}
    }

    async deleteMessage(userId:string,messageId:string): Promise<{message:IMessage|null}> {
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new UnauthorizedError(MESSAGES.UNAUTHORIZED)
        }
        const messageExist = await this.messageRepository.findMessageById(messageId)
        if(!messageExist){
            throw new NotFoundError(MESSAGES.MESSAGE_NOT_FOUND)
        }
        const message = await this.messageRepository.deleteMessageById(messageId)
        return {message};
    }

}