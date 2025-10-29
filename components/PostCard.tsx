import React from 'react';
import { Post, Creator } from '../types';
import { LikeIcon, CommentIcon, SendIcon, TipIcon, LockIcon } from './icons';

interface PostCardProps {
  post: Post;
  creator?: Creator;
  onCreatorClick: (creatorId: string) => void;
  canDelete?: boolean;
  onDelete?: (postId: string) => void;
}

// FIX: Updated default value for onDelete to accept an argument to match its usage, preventing a type error.
const PostCard: React.FC<PostCardProps> = ({ post, creator, onCreatorClick, canDelete = false, onDelete = (_) => {} }) => {
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
        {canDelete && (
            <button onClick={() => onDelete(post.id)} className="text-light-3 hover:text-red-500 p-2 rounded-full">
                &hellip;
            </button>
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
           <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
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