export type UserRole = 'fan' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  subscribedTo: string[]; // Array of creator IDs
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  subscriptionPrice: number;
  accessCode: string;
  isVerified: boolean;
}

export interface Post {
  id:string;
  creatorId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  tips: number; // Added tips
}

export interface Message {
    id: string;
    fromId: string;
    toId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
}
