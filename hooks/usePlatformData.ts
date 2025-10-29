import { useState, useCallback, useMemo, useEffect } from 'react';
import { Creator, Post, User, Message } from '../types';

// --- MOCK DATABASE ---

const USERS_DB: User[] = [
    { id: 'user-fan-1', name: 'Brenda Fan', avatarUrl: 'https://picsum.photos/seed/brenda/200/200', role: 'fan', subscribedTo: ['creator-2', 'creator-1'], bio: 'Just a fan enjoying the great content here! My favorite creators are Chef Marco and Elena Voyage.' },
    { id: 'user-creator-1', name: 'Alex Codes', avatarUrl: 'https://picsum.photos/seed/alex/200/200', role: 'creator', subscribedTo: [] },
    { id: 'user-admin-1', name: 'Admin', avatarUrl: 'https://picsum.photos/seed/admin/200/200', role: 'admin', subscribedTo: [] },
];

const CREATORS_DB: Creator[] = [
  {
    id: 'creator-1',
    name: 'Elena Voyage',
    handle: 'elenavoyage',
    bio: 'Exploring the world one photo at a time. Join my journey for **exclusive travel content** and behind-the-scenes stories. Check out my latest trip [here](https://example.com)!',
    avatarUrl: 'https://picsum.photos/seed/elena/200/200',
    bannerUrl: 'https://picsum.photos/seed/elenabanner/1200/400',
    isVerified: true,
    subscriptionPrice: 5,
    accessCode: 'TRAVEL',
  },
  {
    id: 'creator-2',
    name: 'Chef Marco',
    handle: 'marcoskitchen',
    bio: 'Gourmet recipes made simple. Sub for weekly cooking classes, secret ingredients, and mouth-watering food photography.',
    avatarUrl: 'https://picsum.photos/seed/marco/200/200',
    bannerUrl: 'https://picsum.photos/seed/marcobanner/1200/400',
    isVerified: true,
    subscriptionPrice: 10,
    accessCode: 'FOODIE',
  },
  {
    id: 'creator-3',
    name: 'FitFlow Yoga',
    handle: 'fitflow',
    bio: 'Your daily dose of mindfulness and movement. Access to my full library of yoga classes, meditation guides, and wellness tips.',
    avatarUrl: 'https://picsum.photos/seed/yoga/200/200',
    bannerUrl: 'https://picsum.photos/seed/yogabanner/1200/400',
    isVerified: false,
    subscriptionPrice: 7.5,
    accessCode: 'YOGA',
  },
  {
    id: 'creator-4', // Corresponds to user-creator-1
    name: 'Alex Codes',
    handle: 'alexcodes',
    bio: 'Building the future, one line of code at a time. Follow for tutorials, project deep-dives, and career advice in tech.',
    avatarUrl: 'https://picsum.photos/seed/alex/200/200',
    bannerUrl: 'https://picsum.photos/seed/alexbanner/1200/400',
    isVerified: true,
    subscriptionPrice: 15,
    accessCode: 'DEV',
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
    isPrivate: true,
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
    isPrivate: true,
  },
   {
    id: 'p3',
    creatorId: 'creator-4',
    text: 'Just pushed a major update to my open-source project. Deep dive video for all my patrons is now live!',
    timestamp: '2023-10-26T18:00:00Z',
    likes: 890,
    comments: 54,
    tips: 75,
    isPrivate: false,
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
    isPrivate: true,
  },
];

// Generate more messages for a long history example
const generatedMessages: Message[] = [];
for (let i = 0; i < 50; i++) {
    const timestamp = new Date(new Date('2023-10-27T11:00:00Z').getTime() - (i + 3) * 60 * 1000).toISOString(); // Messages every minute before the existing ones
    const fromId = i % 2 === 1 ? 'creator-2' : 'user-fan-1';
    const toId = i % 2 === 1 ? 'user-fan-1' : 'creator-2';
    generatedMessages.push({
        id: `gen-m${i}`,
        fromId,
        toId,
        text: `This is an older message, number ${50 - i}.`,
        timestamp,
        isRead: true,
        status: 'sent',
    });
}

const MESSAGES_DB: Message[] = [
    ...generatedMessages,
    { id: 'm1', fromId: 'user-fan-1', toId: 'creator-2', text: 'Hey Chef Marco! Loved the scallop recipe!', timestamp: '2023-10-27T11:00:00Z', isRead: true, status: 'sent' },
    { id: 'm2', fromId: 'creator-2', toId: 'user-fan-1', text: 'Glad you enjoyed it Brenda!', timestamp: '2023-10-27T11:01:00Z', isRead: false, status: 'sent' },
    { id: 'm3', fromId: 'user-fan-1', toId: 'creator-1', text: 'The Alps wallpaper is stunning!', timestamp: '2023-10-27T10:05:00Z', isRead: true, status: 'sent' },
]

const MESSAGE_PAGE_SIZE = 15;

export const usePlatformData = () => {
  const [users, setUsers] = useState<User[]>(USERS_DB);
  const [creators, setCreators] = useState<Creator[]>(CREATORS_DB);
  const [posts, setPosts] = useState<Post[]>(POSTS_DB);
  const [messages, setMessages] = useState<Message[]>(MESSAGES_DB);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});

  // Real-time message and typing simulator
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulate receiving a message
      const fan = users.find(u => u.role === 'fan');
      if (!fan || fan.subscribedTo.length === 0) return;

      const randomCreatorId = fan.subscribedTo[Math.floor(Math.random() * fan.subscribedTo.length)];
      const creator = creators.find(c => c.id === randomCreatorId);
      if (!creator) return;
      
      const newText = `This is a new message from ${creator.name}! ${Date.now()}`;
      
      // Simulate typing indicator before message arrives
      setTypingStatus(prev => ({ ...prev, [creator.id]: true }));
      
      setTimeout(() => {
         setMessages(prevMessages => {
            const newMessage: Message = {
              id: `m${Date.now()}`,
              fromId: randomCreatorId,
              toId: fan.id,
              text: newText,
              timestamp: new Date().toISOString(),
              isRead: false,
              status: 'sent',
            };
            return [newMessage, ...prevMessages];
         });
         setTypingStatus(prev => ({ ...prev, [creator.id]: false }));
      }, Math.random() * 2000 + 1000); // Typing time between 1-3 seconds


    }, 12000); // New message arrives every 12 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [users, creators]);

  const getCreatorByUserId = useCallback((userId: string) => {
      const user = users.find(u => u.id === userId);
      if(user?.role !== 'creator') return undefined;
      return creators.find(c => c.name === user.name);
  }, [users, creators]);
  
  const followCreator = useCallback((userId: string, creatorId: string) => {
    setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId && !user.subscribedTo.includes(creatorId)
        ? { ...user, subscribedTo: [...user.subscribedTo, creatorId] } 
        : user
    ));
  }, []);

  const unfollowCreator = useCallback((userId: string, creatorId: string) => {
    setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, subscribedTo: user.subscribedTo.filter(id => id !== creatorId) } : user
    ));
  }, []);

  const addPost = useCallback((creatorId: string, text: string, imageUrl: string | undefined, isPrivate: boolean) => {
    const newPost: Post = {
        id: `p${Date.now()}`,
        creatorId, text, imageUrl, isPrivate,
        timestamp: new Date().toISOString(),
        likes: 0, comments: 0, tips: 0
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);
  
  const getCreatorById = useCallback((creatorId: string) => creators.find(c => c.id === creatorId), [creators]);
  const getPostsByCreatorId = useCallback((creatorId: string) => posts.filter(p => p.creatorId === creatorId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [posts]);
  
  const getSubscribedPosts = useCallback((currentUser: User) => {
    return posts.filter(p => currentUser.subscribedTo.includes(p.creatorId)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);
  
  const getFollowerCount = useCallback((creatorId: string) => {
    return users.filter(user => user.subscribedTo.includes(creatorId)).length;
  }, [users]);

  const updateCreatorProfile = useCallback((creatorId: string, newProfileData: Partial<Creator>) => {
      setCreators(prev => prev.map(c => c.id === creatorId ? { ...c, ...newProfileData } : c));
  }, []);


  // Admin functions
  const toggleCreatorVerification = useCallback((creatorId: string) => {
      setCreators(prev => prev.map(c => c.id === creatorId ? {...c, isVerified: !c.isVerified} : c));
  }, []);

  const removePost = useCallback((postId: string) => {
      setPosts(prev => prev.filter(p => p.id !== postId));
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
            // Merge User and Creator properties, giving Creator precedence for shared keys
            map.set(creatorProfile.id, { ...cu, ...creatorProfile });
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

  const getMessagesPaginated = useCallback((userId1: string, userId2:string, page: number) => {
    const allRelevantMessages = messages
      .filter(msg =>
        (msg.fromId === userId1 && msg.toId === userId2) ||
        (msg.fromId === userId2 && msg.toId === userId1)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const startIndex = (page - 1) * MESSAGE_PAGE_SIZE;
    const endIndex = startIndex + MESSAGE_PAGE_SIZE;

    const messagesForPage = allRelevantMessages.slice(startIndex, endIndex);
    const hasMore = allRelevantMessages.length > endIndex;

    return {
        // Return messages sorted chronologically for display in the chat window
        messages: messagesForPage.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        hasMore
    };
  }, [messages]);
  
  const sendMessage = useCallback((fromId: string, toId: string, text: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromId,
      toId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      status: 'sending',
    };
    setMessages(prev => [newMessage, ...prev]);

    // Simulate network delay and potential failure
    setTimeout(() => {
        const didFail = Math.random() < 0.2; // 20% chance of failure
        const newStatus = didFail ? 'failed' : 'sent';
        
        setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: newStatus } : msg
        ));
    }, 1500); // 1.5 second delay
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
  
  const getTotalUnreadCount = useCallback((userId: string): number => {
      const counts = getUnreadMessageCounts(userId);
      // FIX: Cast Object.values(counts) to number[] to resolve incorrect type inference that caused an "unknown is not assignable to number" error.
      return (Object.values(counts) as number[]).reduce((total, count) => total + count, 0);
  }, [getUnreadMessageCounts]);

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
    users, creators, posts, messages, typingStatus,
    getCreatorById, getPostsByCreatorId, getSubscribedPosts,
    followCreator, unfollowCreator, getFollowerCount,
    addPost, getCreatorByUserId, updateCreatorProfile,
    toggleCreatorVerification, removePost,
    // Messaging
    allUsersMap, getConversations, getMessagesPaginated, sendMessage, getUnreadMessageCounts, markMessagesAsRead, getTotalUnreadCount,
  };
};