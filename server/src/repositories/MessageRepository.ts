import { Types } from 'mongoose';
import Message from '../models/MessageModel'
import { IMessage, IMessageRepository } from '../interfaces';
import BaseRepository from './BaseRepository';


class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
    constructor(){
        super(Message)
    }

    async createMessage(messageData: Partial<IMessage>): Promise<IMessage>{
        return await this.create(messageData)
    }

    async findMessageById(messageId:string): Promise<IMessage|null>{
      return await this.findById(messageId)
    }

    async findMessagesByChatId(chatId:string): Promise<IMessage[]>{
        return await Message.find({chatId})
    }

    async updateMessageReadStatus(userId: string, chatId: string): Promise<void> {
            await Message.updateMany(
          {
            chatId,
            receiverId: userId,
            isRead: false,
          },
          {
            $set: { isRead: true },
          }
        );
    }

    async countUserUnreadChats(userId: string): Promise<number> {
      const result = await Message.aggregate([
    { 
      $match: { 
        receiverId: new Types.ObjectId(userId), 
        isRead: false,
        isDeleted: false 
      } 
    },
    { 
      $group: { 
        _id: "$chatId" 
      } 
    },
    { 
      $count: "unreadChatCount" 
    }
  ]);

  return result[0]?.unreadChatCount || 0;
    }
    
    async deleteMessageById(messageId: string): Promise<IMessage | null> {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.mediaUrl && !message.content) {
    return await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true, mediaUrl: "This media has been deleted" },
      { new: true }
    );
  }

  if (message.content && !message.mediaUrl) {
    return await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true, content: "This message has been deleted" },
      { new: true }
    );
  }

  throw new Error("Invalid message state for deletion");
    }

}

export default new MessageRepository();