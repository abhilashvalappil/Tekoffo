import { ChatContactPreview, IMessage } from "../entities/IMessage";


export interface IMessageRepository {
    createMessage(messageData: Partial<IMessage>): Promise<IMessage>
    findMessageById(messageId:string): Promise<IMessage|null>
    findMessagesByChatId(chatId:string): Promise<IMessage[]>
    updateMessageReadStatus(userId: string, chatId: string): Promise<void>
    countUserUnreadChats(userId: string): Promise<number>
    deleteMessageById(messageId:string): Promise<IMessage|null>
}