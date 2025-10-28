import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Message, Creator } from '../types';
import { usePlatformData } from '../hooks/usePlatformData';
import { SendIcon, ArrowLeftIcon, MicIcon, MicOffIcon, SparklesIcon } from './icons';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from "@google/genai";
import { generateSuggestedReplies } from '../services/geminiService';

// --- Live API Helper functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface MessagingViewProps {
  currentUser: User;
  initialConversationUserId: string | null;
  platformData: ReturnType<typeof usePlatformData>;
  onNavigate: (view: string, params?: any) => void;
}

const MessagingView: React.FC<MessagingViewProps> = ({ currentUser, initialConversationUserId, platformData, onNavigate }) => {
  const { allUsersMap, getConversations, getMessages, sendMessage, getUnreadMessageCounts, markMessagesAsRead, typingStatus } = platformData;
  
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(initialConversationUserId);
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const conversations = getConversations(currentUser.id);
  const unreadCounts = getUnreadMessageCounts(currentUser.id);
  const activeMessages = activeConversationUserId ? getMessages(currentUser.id, activeConversationUserId) : [];
  const activeConversationUser = activeConversationUserId ? allUsersMap.get(activeConversationUserId) : null;
  const isOtherUserTyping = activeConversationUserId ? typingStatus[activeConversationUserId] : false;
  
  // --- Effects ---

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
  }, [activeMessages, isOtherUserTyping]);

  useEffect(() => {
    if (activeConversationUserId) {
      const timer = setTimeout(() => {
        markMessagesAsRead(currentUser.id, activeConversationUserId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeConversationUserId, currentUser.id, markMessagesAsRead]);

  useEffect(() => {
    const fetchSuggestions = async () => {
        if (activeMessages.length > 0 && activeMessages[activeMessages.length-1].fromId !== currentUser.id) {
            setIsLoadingSuggestions(true);
            setSuggestions([]);
            const replies = await generateSuggestedReplies(activeMessages, currentUser.id);
            setSuggestions(replies);
            setIsLoadingSuggestions(false);
        }
    };
    fetchSuggestions();
  }, [activeMessages, currentUser.id]);

  useEffect(() => {
    setSuggestions([]);
  }, [activeConversationUserId]);

  const stopRecording = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
        stopRecording();
    };
  }, [stopRecording]);

  // --- Handlers ---
  
  const handleToggleRecording = async () => {
    if (isRecording) {
        stopRecording();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.debug("Live session opened.");
                        // FIX: Cast `window` to `any` to allow access to the vendor-prefixed `webkitAudioContext` for older browser compatibility, resolving a TypeScript error.
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                        scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(audioContextRef.current.destination);
                    },
                    onmessage: (message: LiveServerMessage) => {
                        const transcript = message.serverContent?.inputTranscription?.text;
                        if (transcript) {
                            setMessageText(prev => prev ? `${prev} ${transcript}`.trim() : transcript);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        stopRecording();
                    },
                    onclose: () => {
                        console.debug('Live session closed.');
                        stream.getTracks().forEach(track => track.stop());
                    },
                },
                config: {
                    inputAudioTranscription: {},
                },
            });

        } catch (error) {
            console.error("Failed to start recording:", error);
            setIsRecording(false);
        }
    }
  };


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && activeConversationUserId) {
      sendMessage(currentUser.id, activeConversationUserId, messageText);
      setMessageText('');
      setSuggestions([]);
    }
  };
  
   const handleSuggestionClick = (suggestion: string) => {
    setMessageText(suggestion);
    setSuggestions([]);
  }

  // --- Render Functions ---

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    return Math.floor(interval) + "m";
  };
  
  const formatMessageTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
            <button className="flex items-center space-x-4 group" onClick={() => onNavigate('profile', { userId: activeConversationUser.id })}>
                <img src={activeConversationUser.avatarUrl} alt={activeConversationUser.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-bold group-hover:text-brand-primary transition-colors">{activeConversationUser.name}</h3>
                  { (activeConversationUser as Creator).handle && <p className="text-sm text-light-3 text-left">@{(activeConversationUser as Creator).handle}</p>}
                </div>
            </button>
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
              {isOtherUserTyping && (
                <div className="flex items-end">
                    <div className="px-4 py-2 rounded-2xl max-w-lg bg-dark-3 text-light-1 rounded-bl-none">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-dark-3">
             {(isLoadingSuggestions || suggestions.length > 0) && (
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                  {isLoadingSuggestions ? (
                      <p className="text-sm text-light-3 flex items-center gap-2"><SparklesIcon /> Thinking of replies...</p>
                  ) : (
                      suggestions.map((s, i) => (
                          <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-1 bg-dark-3 text-light-2 text-sm rounded-full hover:bg-brand-primary hover:text-dark-1 transition-colors">
                            {s}
                          </button>
                      ))
                  )}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
               <button type="button" onClick={handleToggleRecording} className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500/80 text-white animate-pulse' : 'bg-dark-3 text-light-2 hover:bg-dark-2'}`}>
                  {isRecording ? <MicOffIcon /> : <MicIcon />}
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={isRecording ? 'Listening...' : "Type a message..."}
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