export interface MessagePayload {
  chatId:string;
  receiverId: string;
  content: string;
}


export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?:string;
  isRead: boolean;
  isDeleted: boolean;
  timestamp?: string; // or createdAt
}

export interface Contact {
  _id: string; 
  participants: string[];  
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  contact: {
    _id: string;
    fullName: string;
    profilePicture: string;
    companyName?: string;
  };
  messages?: Message[]; 
}

export interface SocketMessage {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?: string;
  isRead: boolean;
  isDeleted: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


// export interface Message {
//     chatId: string;
//     senderId: string;
//     receiverId: string;
//     content: string;
//     isRead: boolean;
//     timestamp: Date;
//     createdAt?: Date;
//     updatedAt?: Date;
// }