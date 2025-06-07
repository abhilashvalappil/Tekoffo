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

export interface ChatPartner {
  _id: string;
  username: string;
  email: string;
  role: 'client' | 'freelancer' | 'admin';
  fullName: string;
  companyName?: string;
  description: string;
  country: string;
  isBlocked: boolean;
  isGoogleAuth: boolean;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profilePicture?: string;
  preferredJobFields?: string[];
  skills?: string[];
  stripeAccountId?: string;
  total_Earnings?: number;
  total_Spent?: number;
  createdAt?: string;
  updatedAt?: string;
}