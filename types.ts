export type UserRole = 'fan' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl?: string;
  avatar?: string; // Alias for avatarUrl
  role: UserRole;
  subscribedTo?: string[]; // Array of creator IDs
  bio?: string;
  balance: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarUrl?: string;
  avatar?: string; // Alias for avatarUrl
  bannerUrl?: string;
  bannerImage?: string; // Alias for bannerUrl
  isVerified: boolean;
  subscriptionPrice?: number;
  monthlyPrice?: number; // Alias for subscriptionPrice
  subscribers?: number;
  accessCode: string;
}

export interface Post {
  id: string;
  creatorId: string;
  text?: string;
  content?: string; // Alias for text
  imageUrl?: string;
  timestamp?: string;
  createdAt?: string; // Alias for timestamp
  likes: number;
  comments?: number;
  tips?: number; // Added tips
  isPrivate: boolean;
}

export interface Message {
    id: string;
    fromId: string;
    toId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
}

export type TransactionType = 'subscription' | 'tip' | 'deposit';

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    timestamp: string;
    relatedCreatorId?: string; // For subscriptions and tips
    relatedPostId?: string; // For tips
}