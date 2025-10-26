import React from 'react';
import { Creator } from '../types';
import { CheckIcon, MessagesIcon } from './icons';

interface ProfileHeaderProps {
  creator: Creator;
  postCount: number;
  isSubscribed: boolean;
  isOwnProfile: boolean;
  onSubscribeClick: () => void;
  onUnsubscribe: (creatorId: string) => void;
  onEditProfile: () => void;
  onMessageClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ creator, postCount, isSubscribed, isOwnProfile, onSubscribeClick, onUnsubscribe, onEditProfile, onMessageClick }) => {
  
  const renderButtons = () => {
    if (isOwnProfile) {
        return (
             <button 
                onClick={onEditProfile}
                className='bg-dark-3 text-light-2 px-6 py-2 rounded-full font-semibold transition-colors hover:bg-dark-3/80'
            >
                Edit Profile
            </button>
        )
    }
    if (isSubscribed) {
        return (
            <div className="flex items-center space-x-2">
                 <button 
                    onClick={onMessageClick}
                    className='bg-dark-3 text-light-2 p-3 rounded-full font-semibold transition-colors hover:bg-brand-primary hover:text-dark-1'
                >
                    <MessagesIcon />
                </button>
                <button 
                    onClick={() => onUnsubscribe(creator.id)}
                    className='bg-dark-3 text-light-2 px-6 py-2 rounded-full font-semibold transition-colors hover:bg-red-500/20 hover:text-red-400 group flex items-center space-x-2'
                >
                    <span className="group-hover:hidden flex items-center space-x-2"><CheckIcon/><span>Subscribed</span></span>
                    <span className="hidden group-hover:block">Unsubscribe</span>
                </button>
            </div>
        )
    }
    return (
        <button 
            onClick={onSubscribeClick}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 bg-brand-primary text-dark-1 hover:bg-brand-secondary`}
        >
            {`Subscribe for $${creator.subscriptionPrice}/mo`}
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
        <p className="mt-4 text-light-2">{creator.bio}</p>
        <div className="mt-4 flex space-x-6 text-sm">
            <p><span className="font-bold">{postCount}</span> <span className="text-light-3">Posts</span></p>
            <p><span className="font-bold">1.2M</span> <span className="text-light-3">Fans</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;