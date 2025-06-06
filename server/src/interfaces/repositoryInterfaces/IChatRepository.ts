import { IChat, IChatContactPreview } from "../entities/IChat";

 

export interface IChatRepository {
    findChat(senderId:string,receiverId:string): Promise<IChat|null>
    createChat(senderId: string, receiverId: string): Promise<IChat>
    findChatById(chatId:string): Promise<IChat|null>
    getChatContactsByUserId(userId: string): Promise<IChatContactPreview[]>
}