import React, { useState, useRef, useEffect } from 'react';
import { Post, Creator } from '../types';
import { LikeIcon, CommentIcon, SendIcon, TipIcon, LockIcon, EditIcon, DeleteIcon } from './icons';

interface PostCardProps {
  post: Post;
  creator?: Creator;
  onCreatorClick: (creatorId: string) => void;
  canManage?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onTip?: (postId: string) => void;
  canTip?: boolean;
}

// FIX: The default function for `onEdit` prop was missing a parameter, causing a type mismatch.
// FIX: The default function for the `onTip` prop did not accept any arguments, causing an error when it was called with the post ID.
const PostCard: React.FC<PostCardProps> = ({ post, creator, onCreatorClick, canManage = false, onEdit = (_) => {}, onDelete = (_) => {}, onTip = (_) => {}, canTip = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!creator) return null;

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

  return (
    <div className="bg-dark-2 border border-dark-3 rounded-lg overflow-hidden mb-6">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
            <img
            src={creator.avatarUrl}
            alt={creator.name}
            className="w-12 h-12 rounded-full mr-4 cursor-pointer"
            onClick={() => onCreatorClick(creator.id)}
            />
            <div>
            <h3 
                className="font-bold text-light-1 cursor-pointer"
                onClick={() => onCreatorClick(creator.id)}
            >
                {creator.name}
            </h3>
            <p className="text-sm text-light-3 flex items-center space-x-2">
                <span>@{creator.handle} &middot; {timeAgo(post.timestamp)}</span>
                {post.isPrivate && <LockIcon />}
            </p>
            </div>
        </div>
        {canManage && (
            <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-light-3 hover:text-light-1 p-2 rounded-full hover:bg-dark-3">
                    &hellip;
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-dark-3 rounded-md shadow-lg z-10 animate-fade-in-up origin-top-right">
                        <button 
                            onClick={() => { onEdit(post); setMenuOpen(false); }} 
                            className="w-full text-left px-4 py-2 text-sm text-light-2 hover:bg-dark-1 flex items-center rounded-t-md"
                        >
                           <EditIcon /> Edit Post
                        </button>
                        <button 
                            onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-1 flex items-center rounded-b-md"
                        >
                           <DeleteIcon /> Delete Post
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
      
      <p className="px-4 pb-4 text-light-2 whitespace-pre-wrap">{post.text}</p>
      
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-[600px] object-cover" />
      )}
      
      <div className="p-4 flex justify-between items-center text-light-3">
        <div className="flex space-x-6">
          <button className="flex items-center space-x-2 hover:text-brand-primary transition-colors">
            <LikeIcon />
            <span>{post.likes.toLocaleString()}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-brand-primary transition-colors">
            <CommentIcon />
            <span>{post.comments.toLocaleString()}</span>
          </button>
           <button 
                className="flex items-center space-x-2 hover:text-green-400 transition-colors disabled:text-light-3 disabled:cursor-not-allowed"
                onClick={() => onTip(post.id)}
                disabled={!canTip}
            >
            <TipIcon />
            <span>${post.tips.toLocaleString()}</span>
          </button>
        </div>
        <button className="hover:text-brand-primary transition-colors">
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default PostCard;