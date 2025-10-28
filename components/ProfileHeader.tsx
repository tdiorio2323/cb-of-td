import React from 'react';
import { Creator } from '../types';
import { CheckIcon, MessagesIcon } from './icons';

interface ProfileHeaderProps {
  creator: Creator;
  postCount: number;
  followerCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
  onFollowClick: () => void;
  onUnfollow: (creatorId: string) => void;
  onEditProfile: () => void;
  onMessageClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ creator, postCount, followerCount, isFollowing, isOwnProfile, onFollowClick, onUnfollow, onEditProfile, onMessageClick }) => {
  
  const parseMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    let html = text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italics
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-primary hover:underline">$1</a>'); // Links
    return { __html: html };
  };

  const renderButtons = () => {
    if (isOwnProfile) {
        return (
             <button 
                onClick={onEditProfile}
                className='bg-brand-primary text-dark-1 px-6 py-2 rounded-full font-semibold transition-colors hover:bg-brand-secondary'
            >
                Edit Profile
            </button>
        )
    }
    if (isFollowing) {
        return (
            <div className="flex items-center space-x-2">
                 <button 
                    onClick={onMessageClick}
                    className='bg-dark-3 text-light-2 p-3 rounded-full font-semibold transition-colors hover:bg-brand-primary hover:text-dark-1'
                >
                    <MessagesIcon />
                </button>
                <button 
                    onClick={() => onUnfollow(creator.id)}
                    className='bg-dark-3 text-light-2 px-6 py-2 rounded-full font-semibold transition-colors hover:bg-red-500/20 hover:text-red-400 group flex items-center space-x-2'
                >
                    <span className="group-hover:hidden flex items-center space-x-2"><CheckIcon/><span>Following</span></span>
                    <span className="hidden group-hover:block">Unfollow</span>
                </button>
            </div>
        )
    }
    return (
        <button 
            onClick={onFollowClick}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 bg-brand-primary text-dark-1 hover:bg-brand-secondary`}
        >
            Follow
        </button>
    )
  }
  
  return (
    <div className="mb-8">
      <div className="h-48 md:h-64 bg-dark-3 relative">
        <img src={creator.bannerUrl} alt={`${creator.name}'s banner`} className="w-full h-full object-cover"/>
        <div className="absolute -bottom-16 left-8">
            <img src={creator.avatarUrl} alt={creator.name} className="w-32 h-32 rounded-full border-4 border-dark-1"/>
        </div>
      </div>
      <div className="pt-20 px-8 pb-4 bg-dark-2 rounded-b-lg">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold">{creator.name}</h1>
                <p className="text-md text-light-3">@{creator.handle}</p>
            </div>
            {renderButtons()}
        </div>
        <div dangerouslySetInnerHTML={parseMarkdown(creator.bio)} className="mt-4 text-light-2 prose prose-invert max-w-none" />
        <div className="mt-4 flex space-x-6 text-sm">
            <p><span className="font-bold">{postCount}</span> <span className="text-light-3">Posts</span></p>
            <p><span className="font-bold">{followerCount.toLocaleString()}</span> <span className="text-light-3">Followers</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;