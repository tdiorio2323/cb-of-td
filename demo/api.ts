import { mockPosts, mockCreator, mockInbox, mockThread, mockReceipt, mockPayouts, mockAnalytics, mockNotifications, mockCreators } from './factories';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const demoApi = {
  feed: async () => {
    await delay();
    return mockPosts(24);
  },

  creator: async (handle: string) => {
    await delay();
    return mockCreator(handle);
  },

  creators: async (n = 8) => {
    await delay();
    return mockCreators(n);
  },

  messages: async (threadId?: string) => {
    await delay();
    return threadId ? mockThread(threadId) : mockInbox();
  },

  purchase: async (itemId: string) => {
    await delay(500);
    return { ok: true, receipt: mockReceipt(itemId) };
  },

  upload: async (file: any) => {
    await delay(1000);
    return { id: crypto.randomUUID(), url: '/demo/file.jpg' };
  },

  payouts: async () => {
    await delay();
    return mockPayouts();
  },

  analytics: async () => {
    await delay();
    return mockAnalytics();
  },

  notifications: async () => {
    await delay();
    return mockNotifications();
  },

  subscribe: async (creatorId: string) => {
    await delay(500);
    return { ok: true, message: 'Subscribed successfully (demo mode)' };
  },

  unlock: async (postId: string) => {
    await delay(500);
    return { ok: true, message: 'Unlocked in demo mode' };
  },
};
