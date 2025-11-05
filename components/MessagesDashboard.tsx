import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';
import { usePlatform } from '../App';
import { Search } from 'lucide-react';
import ChatWindow from './ChatWindow'; 
import MessageInput from './MessageInput';

interface MessagesDashboardProps {
  currentUser: User;
  initialConversationUserId?: string | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function MessagesDashboard({ currentUser, initialConversationUserId = null, onNavigate }: MessagesDashboardProps) {
  const { getConversations, allUsersMap, getUnreadMessageCounts, typingStatus } = usePlatform();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationUserId);
  const [isMobileListVisible, setIsMobileListVisible] = useState(!initialConversationUserId);

  const conversations = useMemo(() => getConversations(currentUser.id), [
    getConversations,
    currentUser.id,
  ]);
  const unreadCounts = useMemo(() => getUnreadMessageCounts(currentUser.id), [
    getUnreadMessageCounts,
    currentUser.id,
  ]);

  useEffect(() => {
    if (initialConversationUserId) {
        setActiveConversationId(initialConversationUserId);
        setIsMobileListVisible(false);
    } else if (!activeConversationId && conversations.length > 0) {
        const otherPartyId =
        conversations[0].fromId === currentUser.id
            ? conversations[0].toId
            : conversations[0].fromId;
        setActiveConversationId(otherPartyId);
    }
  }, [initialConversationUserId, conversations, currentUser.id, activeConversationId]);
  
  const handleConversationSelect = (userId: string) => {
    setActiveConversationId(userId);
    setIsMobileListVisible(false);
  }

  const renderConversationList = () => (
    <div className={`w-full md:w-1/3 h-full bg-dark-2 border-r border-dark-3 flex-col ${isMobileListVisible ? 'flex' : 'hidden md:flex'}`}>
      <div className="p-4 border-b border-dark-3">
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-dark-3 text-white p-2 pl-8 rounded-lg border border-dark-3 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <Search
            size={18}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-light-3"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 && (
          <p className="text-light-3 text-center p-4">
            No conversations yet.
          </p>
        )}
        {conversations.map((msg) => {
          const otherPartyId =
            msg.fromId === currentUser.id ? msg.toId : msg.fromId;
          const otherUser = allUsersMap.get(otherPartyId);
          if (!otherUser) return null;

          const unreadCount = unreadCounts[otherPartyId] || 0;
          const isActive = activeConversationId === otherPartyId;

          return (
            <button
              key={otherPartyId}
              onClick={() => handleConversationSelect(otherPartyId)}
              className={`
                w-full flex items-center gap-3 p-4 text-left transition-colors
                ${isActive ? 'bg-dark-1' : 'hover:bg-dark-3/50'}
              `}
            >
              <img
                src={otherUser.avatarUrl}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="text-white truncate">{otherUser.name}</h3>
                <p className="text-sm text-light-3 truncate">{msg.text}</p>
              </div>
              {unreadCount > 0 && (
                <span className="bg-brand-primary text-dark-1 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderChatWindow = () => {
    if (!activeConversationId) {
      return (
        <div className="w-2/3 h-full items-center justify-center bg-dark-1 hidden md:flex">
          <p className="text-light-3 text-lg">
            Select a conversation to start chatting.
          </p>
        </div>
      );
    }

    const otherUser = allUsersMap.get(activeConversationId);
    if (!otherUser) return null;
    
    return (
      <div className={`w-full md:w-2/3 h-full flex-col bg-dark-1 ${!isMobileListVisible ? 'flex' : 'hidden md:flex'}`}>
        <ChatWindow 
          currentUser={currentUser} 
          otherUser={otherUser} 
          onNavigate={onNavigate}
          onBack={() => setIsMobileListVisible(true)}
        />
        <MessageInput 
          senderId={currentUser.id} 
          receiverId={otherUser.id} 
          isOtherUserTyping={typingStatus[otherUser.id] || false}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-full bg-dark-2 md:rounded-lg overflow-hidden flex">
      {renderConversationList()}
      {renderChatWindow()}
    </div>
  );
}