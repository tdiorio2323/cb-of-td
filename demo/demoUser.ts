import { User } from '@/types';

export type DemoRole = 'fan' | 'creator' | 'admin';

export const demoUsers: Record<DemoRole, User> = {
  fan: {
    id: 'fan_demo',
    role: 'fan',
    handle: 'fan_demo',
    name: 'Ava',
    email: 'ava@demo.creatorhub.com',
    balance: 125.00,
    avatar: '',
  },
  creator: {
    id: 'cr_demo',
    role: 'creator',
    handle: 'closetutor',
    name: 'Mila',
    email: 'mila@demo.creatorhub.com',
    balance: 4820.00,
    avatar: '',
  },
  admin: {
    id: 'ad_demo',
    role: 'admin',
    handle: 'ops',
    name: 'Ops',
    email: 'ops@demo.creatorhub.com',
    balance: 0,
    avatar: '',
  },
} as const;
