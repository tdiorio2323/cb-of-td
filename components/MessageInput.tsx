import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../App';
import {
  generateSuggestedReplies,
  transcribeAudioToText,
} from '../services/geminiService';
import { Send, Mic, Square, Loader2, Sparkles } from 'lucide-react';

interface MessageInputProps {
  senderId: string;
  receiverId: string;
  isOtherUserTyping: boolean;
}

export default function MessageInput({
  senderId,
  receiverId,
  isOtherUserTyping
}: MessageInputProps) {
  const { getMessages, sendMessage } = usePlatform();
  const [messageText, setMessageText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const conversation = getMessages(senderId, receiverId);
      if (
        conversation.length > 0 &&
        conversation[conversation.length - 1].fromId !== senderId
      ) {
        setIsLoadingSuggestions(true);
        setSuggestions([]); 
        const replies = await generateSuggestedReplies(conversation, senderId);
        setSuggestions(replies);
        setIsLoadingSuggestions(false);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [senderId, receiverId, getMessages]);

  const handleSend = () => {
    const text = messageText.trim();
    if (text) {
      sendMessage(senderId, receiverId, text);
      setMessageText('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(senderId, receiverId, suggestion);
    setSuggestions([]);
    setMessageText('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const transcribedText = await transcribeAudioToText(audioBlob);
        setMessageText(transcribedText);
        setIsTranscribing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Auto-resize textarea
   useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [messageText]);

  return (
    <div className="p-4 border-t border-dark-3 bg-dark-1">
      {isOtherUserTyping && (
           <div className="typing-indicator h-5 mb-2">
                <span></span><span></span><span></span>
            </div>
      )}
      {(isLoadingSuggestions || suggestions.length > 0) && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {isLoadingSuggestions && (
            <span className="text-sm text-light-3 flex items-center gap-2">
              <Sparkles size={16} />
              Generating replies...
            </span>
          )}
          {suggestions.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(reply)}
              className="px-3 py-1 bg-dark-3 text-light-2 text-sm rounded-full hover:bg-brand-primary hover:text-dark-1 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-3">
        {!isTranscribing && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`
              flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full transition-colors
              ${isRecording ? 'bg-red-500/80 text-white animate-pulse' : 'bg-dark-3 text-light-2 hover:bg-dark-2'}
            `}
            title={isRecording ? 'Stop Recording' : 'Record Message'}
          >
            {isRecording ? <Square size={20} /> : <Mic size={20} />}
          </button>
        )}
        {isTranscribing && (
          <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
            <Loader2 size={24} className="text-brand-primary animate-spin" />
          </div>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={isRecording ? 'Recording...' : 'Type a message...'}
          className="flex-1 bg-dark-3 p-2.5 rounded-2xl text-light-1 resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary max-h-32"
          disabled={isRecording || isTranscribing}
        />
        <button
          onClick={handleSend}
          disabled={!messageText.trim() || isRecording || isTranscribing}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-brand-primary text-dark-1 transition-colors disabled:bg-dark-3 disabled:cursor-not-allowed hover:bg-brand-secondary"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}