import React, { useEffect, useMemo, useRef } from 'react';
import { User, Creator } from '../types';
import { usePlatform } from '../App';
import { ArrowLeftIcon } from './icons';

interface ChatWindowProps {
  currentUser: User;
  otherUser: User | Creator; 
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

export default function ChatWindow({ currentUser, otherUser, onNavigate, onBack }: ChatWindowProps) {
  const { getMessages, markMessagesAsRead } = usePlatform();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    return getMessages(currentUser.id, otherUser.id);
  }, [getMessages, currentUser.id, otherUser.id]);

  useEffect(() => {
    markMessagesAsRead(currentUser.id, otherUser.id);
  }, [markMessagesAsRead, currentUser.id, otherUser.id, messages]);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <>
      <div className="p-4 border-b border-dark-3 flex items-center gap-3">
         <button className="md:hidden text-light-2" onClick={onBack}>
            <ArrowLeftIcon />
        </button>
        <button className="flex items-center space-x-4 group" onClick={() => onNavigate('profile', { userId: otherUser.id })}>
            <img
            src={otherUser.avatarUrl}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full"
            />
            <div>
                 <h2 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{otherUser.name}</h2>
                 { (otherUser as Creator).handle && <p className="text-sm text-light-3 text-left">@{(otherUser as Creator).handle}</p>}
            </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isSentByMe = msg.fromId === currentUser.id;
          
          return (
             <div key={msg.id} className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-lg ${isSentByMe ? 'bg-brand-primary text-dark-1 rounded-br-none' : 'backdrop-blur-md bg-white/5 border border-white/10 text-light-1 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                   <p className="text-xs text-light-3 mt-1 px-2">{formatMessageTimestamp(msg.timestamp)}</p>
                </div>
          );
        })}
        <div ref={bottomOfChatRef} />
      </div>
    </>
  );
}