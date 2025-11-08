import React, { useState } from 'react';
import { User, Creator } from '../types';
import { usePlatform } from '../App';
import PostCard from './PostCard';
import { PlusCircle } from 'lucide-react';

// --- PROPS ---
interface DiscoverPageProps {
  currentUser: User;
  onCreatorClick: (creatorId: string) => void;
  onTip: (postId: string) => void;
}

export default function DiscoverPage({ currentUser, onCreatorClick, onTip }: DiscoverPageProps) {
  const { getDiscoverFeed, creators, subscribeCreator, getCreatorById } = usePlatform();

  const discoverPosts = getDiscoverFeed(currentUser);

  const subscribedCreatorIds = new Set(currentUser.subscribedTo);
  const creatorsToDiscover = creators.filter(
    (c) => !subscribedCreatorIds.has(c.id) && c.name !== currentUser.name
  );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">Discover</h2>

      {/* --- Section 1: Discover Creators --- */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          New Creators
        </h3>
        {creatorsToDiscover.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
            {creatorsToDiscover.map((creator) => (
              <React.Fragment key={creator.id}>
                <CreatorCard
                  creator={creator}
                  currentUser={currentUser}
                  onSubscribe={subscribeCreator}
                />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            You're already subscribed to every creator!
          </p>
        )}
      </div>

      <hr className="border-gray-700 mb-8" />

      {/* --- Section 2: Discover Posts --- */}
      <h3 className="text-xl font-semibold text-white mb-4">
        Popular Posts
      </h3>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {discoverPosts.length > 0 ? (
          discoverPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              creator={getCreatorById(post.creatorId)}
              onCreatorClick={onCreatorClick}
              canTip={true}
              onTip={onTip}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 p-8 bg-dark-2 rounded-lg">
            <h3 className="text-xl font-semibold">No new posts to show.</h3>
            <p className="mt-2">
              Looks like you've seen everything for now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helper Component for Discoverable Creators ---

interface CreatorCardProps {
  creator: Creator;
  currentUser: User;
  onSubscribe: (
    userId: string,
    creatorId: string,
    accessCode: string
  ) => boolean;
}

function CreatorCard({ creator, currentUser, onSubscribe }: CreatorCardProps) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = () => {
    setError(''); 
    if (!accessCode) {
      setError('Access code is required.');
      return;
    }

    const success = onSubscribe(currentUser.id, creator.id, accessCode);

    if (!success) {
      setError('Invalid code or insufficient funds.');
    } else {
      setAccessCode(''); 
    }
  };

  return (
    <div className="flex-shrink-0 w-64 bg-dark-2 rounded-lg shadow-lg overflow-hidden border border-dark-3">
      <img
        src={creator.bannerUrl}
        alt={`${creator.name} banner`}
        className="w-full h-24 object-cover"
      />
      <div className="p-4 flex flex-col items-center -mt-12">
        <img
          src={creator.avatarUrl}
          alt={creator.name}
          className="w-20 h-20 rounded-full border-4 border-dark-2"
        />
        <h4 className="text-lg font-bold text-white mt-2">{creator.name}</h4>
        <p className="text-sm text-light-3">@{creator.handle}</p>
        <p className="text-xs text-light-2 mt-2 text-center h-10">
          {creator.bio.substring(0, 50)}...
        </p>

        <div className="text-center my-3">
          <span className="text-xl font-bold text-purple-400">
            ${creator.subscriptionPrice.toFixed(2)}
          </span>
          <span className="text-sm text-light-3">/month</span>
        </div>

        <div className="w-full flex flex-col gap-2">
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Access Code"
            className="w-full bg-dark-3 text-white text-sm p-2 rounded-md border border-dark-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            onClick={handleSubscribe}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-dark-1 font-semibold p-2 rounded-md hover:bg-brand-secondary transition-colors"
          >
            <PlusCircle size={16} />
            Subscribe
          </button>
          {error && (
            <p className="text-xs text-red-400 text-center mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
