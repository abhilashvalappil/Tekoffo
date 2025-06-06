import { IChat, IChatContactPreview } from "../entities/IChat";
import { IMessage, MessagePayload } from "../entities/IMessage";

 
 

export interface IChatService {
    getChat(senderId:string,receiverId:string): Promise<{chat:IChat | null}>
    createChat(senderId:string,receiverId:string): Promise<{chat:IChat}>
    createMessage(userId:string,messageData: MessagePayload): Promise<{message:IMessage}>
    getChatContacts(userId:string): Promise<{contacts:IChatContactPreview[]}>
    getMessagesByChat(chatId:string): Promise<{messages:IMessage[]}>
    markMessagesAsRead(userId:string,chatId:string): Promise<void> 
    getUserUnreadChatsCount(userId:string): Promise<{count:number}>
    deleteMessage(userId:string,messageId:string): Promise<{message:IMessage|null}>
}