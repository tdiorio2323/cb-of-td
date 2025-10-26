import { useState, useCallback, useMemo, useEffect } from 'react';
import { Creator, Post, User, Message } from '../types';

// --- MOCK DATABASE ---

const USERS_DB: User[] = [
    { id: 'user-fan-1', name: 'Brenda Fan', avatarUrl: 'https://picsum.photos/seed/brenda/200/200', role: 'fan', subscribedTo: ['creator-2', 'creator-1'] },
    { id: 'user-creator-1', name: 'Alex Codes', avatarUrl: 'https://picsum.photos/seed/alex/200/200', role: 'creator', subscribedTo: [] },
    { id: 'user-admin-1', name: 'Admin', avatarUrl: 'https://picsum.photos/seed/admin/200/200', role: 'admin', subscribedTo: [] },
];

const CREATORS_DB: Creator[] = [
  {
    id: 'creator-1',
    name: 'Elena Voyage',
    handle: 'elenavoyage',
    bio: 'Exploring the world one photo at a time. Join my journey for exclusive travel content and behind-the-scenes stories.',
    avatarUrl: 'https://picsum.photos/seed/elena/200/200',
    bannerUrl: 'https://picsum.photos/seed/elenabanner/1200/400',
    subscriptionPrice: 15,
    accessCode: 'TRAVEL24',
    isVerified: true,
  },
  {
    id: 'creator-2',
    name: 'Chef Marco',
    handle: 'marcoskitchen',
    bio: 'Gourmet recipes made simple. Sub for weekly cooking classes, secret ingredients, and mouth-watering food photography.',
    avatarUrl: 'https://picsum.photos/seed/marco/200/200',
    bannerUrl: 'https://picsum.photos/seed/marcobanner/1200/400',
    subscriptionPrice: 20,
    accessCode: 'FOODIE',
    isVerified: true,
  },
  {
    id: 'creator-3',
    name: 'FitFlow Yoga',
    handle: 'fitflow',
    bio: 'Your daily dose of mindfulness and movement. Access to my full library of yoga classes, meditation guides, and wellness tips.',
    avatarUrl: 'https://picsum.photos/seed/yoga/200/200',
    bannerUrl: 'https://picsum.photos/seed/yogabanner/1200/400',
    subscriptionPrice: 10,
    accessCode: 'NAMASTE',
    isVerified: false,
  },
  {
    id: 'creator-4', // Corresponds to user-creator-1
    name: 'Alex Codes',
    handle: 'alexcodes',
    bio: 'Building the future, one line of code at a time. Follow for tutorials, project deep-dives, and career advice in tech.',
    avatarUrl: 'https://picsum.photos/seed/alex/200/200',
    bannerUrl: 'https://picsum.photos/seed/alexbanner/1200/400',
    subscriptionPrice: 25,
    accessCode: 'DEVLIFE',
    isVerified: true,
  },
];

const POSTS_DB: Post[] = [
  {
    id: 'p1',
    creatorId: 'creator-2',
    text: 'Just perfected my sourdough recipe! The crust is incredible. Subscribers get the full guide this weekend. 🥖',
    imageUrl: 'https://picsum.photos/seed/food1/600/400',
    timestamp: '2023-10-27T10:00:00Z',
    likes: 1200,
    comments: 88,
    tips: 50,
  },
  {
    id: 'p2',
    creatorId: 'creator-1',
    text: 'Sunrise over the Alps. Words can\'t describe this view, but my new 4K wallpaper pack for subscribers comes close!',
    imageUrl: 'https://picsum.photos/seed/alps/600/400',
    timestamp: '2023-10-27T09:30:00Z',
    likes: 3400,
    comments: 210,
    tips: 150,
  },
   {
    id: 'p3',
    creatorId: 'creator-4',
    text: 'Just pushed a major update to my open-source project. Deep dive video for all my patrons is now live!',
    timestamp: '2023-10-26T18:00:00Z',
    likes: 890,
    comments: 54,
    tips: 75,
  },
    {
    id: 'p4',
    creatorId: 'creator-2',
    text: 'This week\'s exclusive recipe: Pan-seared scallops with a lemon-butter sauce. So simple, so elegant.',
    imageUrl: 'https://picsum.photos/seed/scallops/600/400',
    timestamp: '2023-10-25T12:00:00Z',
    likes: 1500,
    comments: 150,
    tips: 90,
  },
];

const MESSAGES_DB: Message[] = [
    { id: 'm1', fromId: 'user-fan-1', toId: 'creator-2', text: 'Hey Chef Marco! Loved the scallop recipe!', timestamp: '2023-10-27T11:00:00Z', isRead: true },
    { id: 'm2', fromId: 'creator-2', toId: 'user-fan-1', text: 'Glad you enjoyed it Brenda!', timestamp: '2023-10-27T11:01:00Z', isRead: false },
    { id: 'm3', fromId: 'user-fan-1', toId: 'creator-1', text: 'The Alps wallpaper is stunning!', timestamp: '2023-10-27T10:05:00Z', isRead: true },
]

export const usePlatformData = () => {
  const [users, setUsers] = useState<User[]>(USERS_DB);
  const [creators, setCreators] = useState<Creator[]>(CREATORS_DB);
  const [posts, setPosts] = useState<Post[]>(POSTS_DB);
  const [messages, setMessages] = useState<Message[]>(MESSAGES_DB);

  // Real-time message simulator
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessages(prevMessages => {
        const fan = users.find(u => u.role === 'fan');
        if (!fan || fan.subscribedTo.length === 0) return prevMessages;

        const randomCreatorId = fan.subscribedTo[Math.floor(Math.random() * fan.subscribedTo.length)];
        const creator = creators.find(c => c.id === randomCreatorId);
        if (!creator) return prevMessages;

        const newMessage: Message = {
          id: `m${Date.now()}`,
          fromId: randomCreatorId,
          toId: fan.id,
          text: `This is a new message from ${creator.name}!`,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        return [newMessage, ...prevMessages];
      });
    }, 8000); // Add a new message every 8 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [users, creators]);

  const getCreatorByUserId = useCallback((userId: string) => {
      const user = users.find(u => u.id === userId);
      if(user?.role !== 'creator') return undefined;
      return creators.find(c => c.name === user.name);
  }, [users, creators]);

  const subscribeWithCode = useCallback((userId: string, creatorId: string, code: string): boolean => {
    const creator = creators.find(c => c.id === creatorId);
    if (creator && creator.accessCode.toUpperCase() === code.toUpperCase()) {
        setUsers(prevUsers => prevUsers.map(user => 
            user.id === userId ? { ...user, subscribedTo: [...user.subscribedTo, creatorId] } : user
        ));
        return true;
    }
    return false;
  }, [creators]);

  const unsubscribe = useCallback((userId: string, creatorId: string) => {
    setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, subscribedTo: user.subscribedTo.filter(id => id !== creatorId) } : user
    ));
  }, []);

  const addPost = useCallback((creatorId: string, text: string, imageUrl?: string) => {
    const newPost: Post = {
        id: `p${Date.now()}`,
        creatorId, text, imageUrl,
        timestamp: new Date().toISOString(),
        likes: 0, comments: 0, tips: 0
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);
  
  const getCreatorById = useCallback((creatorId: string) => creators.find(c => c.id === creatorId), [creators]);
  const getPostsByCreatorId = useCallback((creatorId: string) => posts.filter(p => p.creatorId === creatorId), [posts]);
  
  const getSubscribedPosts = useCallback((currentUser: User) => {
    return posts.filter(p => currentUser.subscribedTo.includes(p.creatorId)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);

  // Admin functions
  const toggleCreatorVerification = useCallback((creatorId: string) => {
      setCreators(prev => prev.map(c => c.id === creatorId ? {...c, isVerified: !c.isVerified} : c));
  }, []);

  const removePost = useCallback((postId: string) => {
      setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);
  
  const updateCreatorAccessCode = useCallback((creatorId: string, newCode: string) => {
    setCreators(prev => prev.map(c => c.id === creatorId ? {...c, accessCode: newCode} : c));
  }, []);

  // --- Messaging Functions ---

  const allUsersMap = useMemo(() => {
    const map = new Map<string, User | Creator>();
    users.forEach(u => map.set(u.id, u));
    // Use the creator ID as the key for creators as well for consistency
    const creatorUsers = users.filter(u => u.role === 'creator');
    creatorUsers.forEach(cu => {
        const creatorProfile = creators.find(c => c.name === cu.name);
        if (creatorProfile) {
            map.set(creatorProfile.id, { ...creatorProfile, ...cu });
        }
    });

    return map;
  }, [users, creators]);

  const getConversations = useCallback((userId: string) => {
    const conversations: { [key: string]: Message } = {};
    messages.forEach(msg => {
      if(msg.fromId === userId || msg.toId === userId) {
        const otherPartyId = msg.fromId === userId ? msg.toId : msg.fromId;
        if (
          !conversations[otherPartyId] ||
          new Date(msg.timestamp) > new Date(conversations[otherPartyId].timestamp)
        ) {
          conversations[otherPartyId] = msg;
        }
      }
    });
    return Object.values(conversations).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages]);

  const getMessages = useCallback((userId1: string, userId2: string) => {
    return messages
      .filter(msg =>
        (msg.fromId === userId1 && msg.toId === userId2) ||
        (msg.fromId === userId2 && msg.toId === userId1)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages]);
  
  const sendMessage = useCallback((fromId: string, toId: string, text: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromId,
      toId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [newMessage, ...prev]);
  }, []);

  const getUnreadMessageCounts = useCallback((userId: string): Record<string, number> => {
    const counts: Record<string, number> = {};
    messages.forEach(msg => {
      if (msg.toId === userId && !msg.isRead) {
        const otherPartyId = msg.fromId;
        counts[otherPartyId] = (counts[otherPartyId] || 0) + 1;
      }
    });
    return counts;
  }, [messages]);

  const markMessagesAsRead = useCallback((userId: string, otherUserId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        (msg.fromId === otherUserId && msg.toId === userId && !msg.isRead) 
        ? { ...msg, isRead: true } 
        : msg
      )
    );
  }, []);


  return { 
    users, creators, posts, messages, 
    getCreatorById, getPostsByCreatorId, getSubscribedPosts,
    subscribeWithCode, unsubscribe, addPost, getCreatorByUserId,
    toggleCreatorVerification, removePost, updateCreatorAccessCode,
    // Messaging
    allUsersMap, getConversations, getMessages, sendMessage, getUnreadMessageCounts, markMessagesAsRead,
  };
};