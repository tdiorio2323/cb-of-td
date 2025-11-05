import React from 'react';
import { usePlatform } from '../../App';
import { DeleteIcon } from '../icons';

const AdminContentPage: React.FC = () => {
  const { posts, removePost, getCreatorById } = usePlatform();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Content Moderation</h2>
      <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
        {posts.map(post => {
          const creator = getCreatorById(post.creatorId);
          return (
            <div key={post.id} className="bg-dark-2 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3 flex-grow overflow-hidden">
                  {creator && (
                    <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-semibold text-light-1 truncate">
                      {creator ? creator.name : 'Unknown Creator'}
                      <span className="text-light-3 font-normal ml-2">@{creator?.handle}</span>
                    </p>
                    <p className="mt-1 text-light-2 break-words">
                      {post.text}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removePost(post.id)}
                  className="ml-4 text-light-3 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full flex-shrink-0 transition-colors"
                  aria-label="Delete post"
                >
                  <DeleteIcon />
                </button>
              </div>
              {post.imageUrl && (
                <div className="mt-3" style={{ paddingLeft: '3.25rem' }}>
                  <img src={post.imageUrl} alt="Post content" className="rounded-lg max-h-48 w-auto object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminContentPage;
