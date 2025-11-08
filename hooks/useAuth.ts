import { useState, useMemo } from 'react';
import { User, UserRole } from '../types';

const MOCK_USERS: { [key in UserRole]: User } = {
  fan: { id: 'user-fan-1', name: 'Brenda Fan', handle: 'brenda_fan', email: 'brenda@creatorhub.com', avatarUrl: 'https://picsum.photos/seed/brenda/200/200', role: 'fan', subscribedTo: ['creator-2', 'creator-1'], balance: 100 },
  creator: { id: 'user-creator-1', name: 'Alex Codes', handle: 'alex_codes', email: 'alex@creatorhub.com', avatarUrl: 'https://picsum.photos/seed/alex/200/200', role: 'creator', subscribedTo: [], balance: 0 },
  admin: { id: 'user-admin-1', name: 'Admin', handle: 'admin', email: 'admin@creatorhub.com', avatarUrl: 'https://picsum.photos/seed/admin/200/200', role: 'admin', subscribedTo: [], balance: 0 },
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.fan);

  const switchUser = (role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
  };

  const aUser = useMemo(() => {
    const originalUser = MOCK_USERS[currentUser.role];
    return { 
        ...originalUser, 
        subscribedTo: currentUser.subscribedTo,
        balance: currentUser.balance ?? originalUser.balance,
    };
  }, [currentUser]);


  return {
    currentUser: aUser,
    setCurrentUser,
    switchUser,
  };
};