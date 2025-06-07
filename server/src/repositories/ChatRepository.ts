import { Types } from 'mongoose';
import Chat from '../models/ChatModel';
import BaseRepository from './BaseRepository';
import { IChat, IChatContactPreview, IChatRepository } from '../interfaces';


class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
    constructor(){
        super(Chat)
    }

    async findChat(senderId:string,receiverId:string): Promise<IChat|null> {
        return await this.findOne({participants:{$all:[senderId, receiverId]}})
    }

    async createChat(senderId: string, receiverId: string): Promise<IChat> {
        return await this.create({
                participants: [
                new Types.ObjectId(senderId),
                new Types.ObjectId(receiverId)
                ]
            });
    }

    async findChatById(chatId:string): Promise<IChat|null> {
        return await this.findById(chatId)
    }
 
    async getChatContactsByUserId(userId: string): Promise<IChatContactPreview[]> {
      const currentUserId = new Types.ObjectId(userId);
        return await Chat.aggregate([
            {
                $match: {
                    participants: { $in: [currentUserId] }
                }
            },
            {
                $addFields: {
                    otherParticipant: {
                        $filter: {
                            input: '$participants',
                            as: 'participant',
                            cond: { $ne: ['$$participant', currentUserId] }
                        }
                    }
                }
            },
            {
                $unwind: '$otherParticipant'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'otherParticipant',
                    foreignField: '_id',
                    as: 'contactUser'
                }
            },
            {
                $unwind: '$contactUser'
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { chatId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$chatId', '$$chatId'] },
                                        { $eq: ['$receiverId', currentUserId] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                }
                            }
                        },
                        {
                            $count: 'unreadCount'
                        }
                    ],
                    as: 'unreadMessages'
                }
            },
            {
                $addFields: {
                    unreadCount: {
                        $cond: [
                            { $gt: [{ $size: '$unreadMessages' }, 0] },
                            { $arrayElemAt: ['$unreadMessages.unreadCount', 0] },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    participants: 1,
                    lastMessage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    unreadCount: 1,
                    contact: {
                        _id: '$contactUser._id',
                        fullName: '$contactUser.fullName',
                        profilePicture: '$contactUser.profilePicture',
                        companyName: '$contactUser.companyName'
                    }
                }
            },
            {
                $sort: { updatedAt: -1 }
            }
        ]);
    }



}

export default new ChatRepository();