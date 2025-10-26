import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { usePlatformData } from '../hooks/usePlatformData';
import { SendIcon, ArrowLeftIcon } from './icons';

interface MessagingViewProps {
  currentUser: User;
  initialConversationUserId: string | null;
}

const MessagingView: React.FC<MessagingViewProps> = ({ currentUser, initialConversationUserId }) => {
  const { allUsersMap, getConversations, getMessages, sendMessage, getUnreadMessageCounts, markMessagesAsRead } = usePlatformData();
  
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(initialConversationUserId);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = getConversations(currentUser.id);
  const unreadCounts = getUnreadMessageCounts(currentUser.id);
  const activeMessages = activeConversationUserId ? getMessages(currentUser.id, activeConversationUserId) : [];
  const activeConversationUser = activeConversationUserId ? allUsersMap.get(activeConversationUserId) : null;

  useEffect(() => {
    if (initialConversationUserId) {
      setActiveConversationUserId(initialConversationUserId);
    } else if (!activeConversationUserId && conversations.length > 0) {
      const otherPartyId = conversations[0].fromId === currentUser.id ? conversations[0].toId : conversations[0].fromId;
      setActiveConversationUserId(otherPartyId);
    }
  }, [initialConversationUserId, conversations, currentUser.id, activeConversationUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  useEffect(() => {
    if (activeConversationUserId) {
      // Use a timeout to give a feeling of "reading" before it disappears
      const timer = setTimeout(() => {
        markMessagesAsRead(currentUser.id, activeConversationUserId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeConversationUserId, currentUser.id, markMessagesAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && activeConversationUserId) {
      sendMessage(currentUser.id, activeConversationUserId, messageText);
      setMessageText('');
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };
  
  const formatMessageTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

    if (date > startOfDay) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    if (date > startOfYesterday) {
      return 'Yesterday';
    }
    if (date > startOfWeek) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    return date.toLocaleDateString();
  };


  const ConversationList = () => (
    <div className={`w-full md:w-1/3 lg:w-1/4 bg-dark-2 border-r border-dark-3 flex flex-col ${activeConversationUserId ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b border-dark-3">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {conversations.map(convo => {
          const otherPartyId = convo.fromId === currentUser.id ? convo.toId : convo.fromId;
          const otherParty = allUsersMap.get(otherPartyId);
          if (!otherParty) return null;

          const unreadCount = unreadCounts[otherPartyId] || 0;
          const hasUnread = unreadCount > 0;

          return (
            <div
              key={otherPartyId}
              onClick={() => setActiveConversationUserId(otherPartyId)}
              className={`p-4 flex items-center space-x-4 cursor-pointer border-b border-dark-3 transition-colors duration-200 ${activeConversationUserId === otherPartyId ? 'bg-dark-3' : hasUnread ? 'bg-brand-primary/10 hover:bg-brand-primary/20' : 'hover:bg-dark-3/50'}`}
            >
              <img src={otherParty.avatarUrl} alt={otherParty.name} className="w-12 h-12 rounded-full" />
              <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold truncate ${hasUnread ? 'text-light-1' : ''}`}>{otherParty.name}</h3>
                  <p className="text-xs text-light-3 flex-shrink-0">{timeAgo(convo.timestamp)}</p>
                </div>
                <div className="flex justify-between items-start mt-1">
                    <p className={`text-sm pr-2 ${hasUnread ? 'text-light-2' : 'text-light-3'} truncate`}>{convo.text}</p>
                    {hasUnread && (
                        <span className="bg-brand-primary text-dark-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {unreadCount}
                        </span>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ChatWindow = () => (
    <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col bg-dark-1 ${!activeConversationUserId ? 'hidden md:flex' : 'flex'}`}>
      {activeConversationUser ? (
        <>
          <div className="p-4 border-b border-dark-3 flex items-center space-x-4">
             <button className="md:hidden text-light-2" onClick={() => setActiveConversationUserId(null)}>
                <ArrowLeftIcon />
            </button>
            <img src={activeConversationUser.avatarUrl} alt={activeConversationUser.name} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-bold">{activeConversationUser.name}</h3>
              { 'handle' in activeConversationUser && <p className="text-sm text-light-3">@{activeConversationUser.handle}</p>}
            </div>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-col space-y-1">
              {activeMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.fromId === currentUser.id ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.fromId === currentUser.id ? 'bg-brand-primary text-dark-1 rounded-br-none' : 'bg-dark-3 text-light-1 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                   <p className="text-xs text-light-3 mt-1 px-2">{formatMessageTimestamp(msg.timestamp)}</p>
                </div>
              ))}
               <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-dark-3">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-dark-3 p-3 rounded-full text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                autoComplete="off"
              />
              <button type="submit" className="bg-brand-primary text-dark-1 p-3 rounded-full disabled:bg-dark-3" disabled={!messageText.trim()}>
                <SendIcon />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center text-light-3">
          <p>Select a conversation to start chatting.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto h-[calc(100vh-11rem)] bg-dark-2 rounded-lg overflow-hidden flex">
      <ConversationList />
      <ChatWindow />
    </div>
  );
};

export default MessagingView;