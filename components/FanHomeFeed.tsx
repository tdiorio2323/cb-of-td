import React from 'react';
import { User } from '../types';
import { usePlatform } from '../App';
import PostCard from './PostCard';

interface FanHomeFeedProps {
  currentUser: User;
  onCreatorClick: (creatorId: string) => void;
  onTip: (postId: string) => void;
}

const FanHomeFeed: React.FC<FanHomeFeedProps> = ({ currentUser, onCreatorClick, onTip }) => {
  const { getMainFeed, getCreatorById } = usePlatform();
  const feedPosts = getMainFeed(currentUser);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold my-4 px-4 md:px-0">Your Feed</h1>
      {feedPosts.length > 0 ? (
        feedPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            creator={getCreatorById(post.creatorId)}
            onCreatorClick={onCreatorClick}
            onTip={onTip}
            canTip={true}
          />
        ))
      ) : (
        <div className="text-center text-light-3 p-8 bg-dark-2 rounded-lg">
          <h3 className="text-xl font-semibold">Your feed is quiet...</h3>
          <p className="mt-2">Follow creators or check out the Discover page to see more posts.</p>
        </div>
      )}
    </div>
  );
};

export default FanHomeFeed;
