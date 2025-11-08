import { Post, Creator, Message, User, Transaction } from '@/types';
import seedrandom from 'seedrandom';

const rng = seedrandom('creatorhub-demo-seed');

const sampleImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
];

const sampleContent = [
  'Just wrapped an amazing photoshoot! Can\'t wait to share the results with you all 📸✨',
  'Behind the scenes of today\'s content creation. You won\'t believe what we have planned!',
  'Exclusive content dropping tonight at 8 PM. Who\'s ready? 🔥',
  'Thank you all for the incredible support! Here\'s a sneak peek of what\'s coming...',
  'New tier unlocked! Check out the exclusive perks available now 💎',
  'Q&A time! Drop your questions below and I\'ll answer them in my next post 💬',
];

export const mockPosts = (n = 12, { lockedRatio = 0.4 } = {}): Post[] => {
  return [...Array(n)].map((_, i) => {
    const isLocked = rng() < lockedRatio;
    return {
      id: `post_${i + 1}`,
      creatorId: `cr_${Math.floor(rng() * 5) + 1}`,
      content: sampleContent[Math.floor(rng() * sampleContent.length)],
      imageUrl: rng() > 0.3 ? `${sampleImages[Math.floor(rng() * sampleImages.length)]}?w=800&h=600&fit=crop&q=80` : undefined,
      isPrivate: isLocked,
      likes: Math.floor(rng() * 500),
      createdAt: new Date(Date.now() - rng() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

const creatorNames = ['Mila', 'Sofia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Luna', 'Harper'];
const creatorHandles = ['closetutor', 'fitnessguru', 'artlover', 'fashionista', 'techsavvy', 'musicvibes', 'yogalife', 'travelmore'];
const creatorBios = [
  'Fitness & wellness coach 🏋️‍♀️ | Helping you reach your goals',
  'Digital artist & creative soul 🎨 | Commissions open',
  'Fashion enthusiast | Style tips & exclusive looks ✨',
  'Tech reviews & tutorials | Making tech simple 💻',
  'Music producer | Exclusive beats & behind-the-scenes 🎵',
  'Yoga instructor | Find your zen 🧘‍♀️',
  'Travel blogger | Exploring the world one post at a time ✈️',
  'Personal development | Mindset & motivation 💪',
];

export const mockCreator = (handle: string): Creator => {
  const index = creatorHandles.indexOf(handle) >= 0 ? creatorHandles.indexOf(handle) : 0;
  return {
    id: `cr_${index + 1}`,
    name: creatorNames[index] || 'Creator',
    handle: handle,
    bio: creatorBios[index] || 'Content creator',
    avatar: `${sampleImages[index % sampleImages.length]}?w=200&h=200&fit=crop&q=80`,
    bannerImage: `${sampleImages[(index + 1) % sampleImages.length]}?w=1200&h=400&fit=crop&q=80`,
    subscribers: Math.floor(100 + rng() * 1000),
    monthlyPrice: [4.99, 9.99, 14.99, 19.99][Math.floor(rng() * 4)],
    accessCode: `demo${index + 1}`,
    isVerified: rng() > 0.3,
  };
};

export const mockCreators = (n = 8): Creator[] => {
  return creatorHandles.slice(0, n).map(handle => mockCreator(handle));
};

export const mockThread = (threadId: string): Message[] => {
  return [
    {
      id: 'msg_1',
      fromId: 'cr_demo',
      toId: 'fan_demo',
      text: 'Hey! Thanks for subscribing 💕',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: 'msg_2',
      fromId: 'fan_demo',
      toId: 'cr_demo',
      text: 'Love your content! Can\'t wait for more',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: 'msg_3',
      fromId: 'cr_demo',
      toId: 'fan_demo',
      text: 'New exclusive post dropping tonight at 8 PM! 🔥',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ];
};

export const mockInbox = (): Array<{ userId: string; userName: string; lastMessage: string; timestamp: string; unread: number }> => {
  return [
    { userId: 'cr_1', userName: 'Mila', lastMessage: 'New exclusive post tonight!', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), unread: 2 },
    { userId: 'cr_2', userName: 'Sofia', lastMessage: 'Thanks for the support!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), unread: 0 },
    { userId: 'cr_3', userName: 'Emma', lastMessage: 'Check out my latest post', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), unread: 1 },
  ];
};

export const mockReceipt = (itemId: string) => ({
  id: `receipt_${Date.now()}`,
  itemId,
  amount: 5.00,
  date: new Date().toISOString(),
  description: 'PPV Content Unlock',
  status: 'completed',
});

export const mockPayouts = (): Transaction[] => {
  return [
    {
      id: 'txn_1',
      userId: 'cr_demo',
      type: 'subscription',
      amount: 9.99,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Monthly subscription',
    },
    {
      id: 'txn_2',
      userId: 'cr_demo',
      type: 'tip',
      amount: 15.00,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Tip from fan',
    },
    {
      id: 'txn_3',
      userId: 'cr_demo',
      type: 'subscription',
      amount: 9.99,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Monthly subscription',
    },
  ];
};

export const mockAnalytics = () => ({
  mrr: 4820.50,
  arpu: 12.30,
  churn: 3.1,
  totalSubscribers: 486,
  newSubscribers: 24,
  revenue30d: 4820.50,
  topPosts: [
    { id: 'post_1', views: 1240, likes: 380, revenue: 125.50 },
    { id: 'post_2', views: 980, likes: 290, revenue: 98.00 },
    { id: 'post_3', views: 765, likes: 210, revenue: 76.50 },
  ],
});

export const mockNotifications = () => [
  { id: 'notif_1', type: 'like', message: 'Mila liked your comment', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), read: false },
  { id: 'notif_2', type: 'subscription', message: 'New post from Sofia', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'notif_3', type: 'message', message: 'Emma sent you a message', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: true },
];
