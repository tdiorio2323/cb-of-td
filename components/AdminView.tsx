import React from 'react';
import { User } from '../types';
import { usePlatformData } from '../hooks/usePlatformData';
import { VerifiedIcon, UnverifiedIcon, DeleteIcon } from './icons';

interface AdminViewProps {
  currentUser: User;
  platformData: ReturnType<typeof usePlatformData>;
}

const AdminView: React.FC<AdminViewProps> = ({ currentUser, platformData }) => {
  const { 
    creators, 
    posts,
    users, 
    toggleCreatorVerification,
    removePost,
    getCreatorById,
    } = platformData;

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-dark-2 p-6 rounded-lg">
          <p className="text-light-3 text-sm">Total Users</p>
          <p className="text-4xl font-bold">{users.length}</p>
        </div>
        <div className="bg-dark-2 p-6 rounded-lg">
          <p className="text-light-3 text-sm">Total Creators</p>
          <p className="text-4xl font-bold">{creators.length}</p>
        </div>
        <div className="bg-dark-2 p-6 rounded-lg">
          <p className="text-light-3 text-sm">Total Posts</p>
          <p className="text-4xl font-bold">{posts.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Creator Management */}
        <div>
            <h2 className="text-2xl font-bold mb-4">Creator Management</h2>
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
              {creators.map(creator => (
                <div key={creator.id} className="bg-dark-2 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full"/>
                    <div className="flex-grow">
                      <p className="font-bold text-light-1">{creator.name}</p>
                      <p className="text-sm text-light-3">@{creator.handle}</p>
                    </div>
                    <div>
                      {creator.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <button 
                      onClick={() => toggleCreatorVerification(creator.id)}
                      className={`px-4 py-2 text-xs rounded-full font-semibold ${creator.isVerified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                    >
                      {creator.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop View: Table */}
            <div className="hidden md:block bg-dark-2 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-dark-3">
                        <tr>
                            <th className="p-4">Creator</th>
                            <th className="p-4">Handle</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creators.map(creator => (
                            <tr key={creator.id} className="border-b border-dark-3 last:border-0">
                                <td className="p-4 flex items-center space-x-3">
                                    <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full"/>
                                    <span>{creator.name}</span>
                                </td>
                                <td className="p-4 text-light-3">@{creator.handle}</td>
                                <td className="p-4 text-center">
                                    {creator.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => toggleCreatorVerification(creator.id)}
                                        className={`px-3 py-1 text-xs rounded-full ${creator.isVerified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                                    >
                                        {creator.isVerified ? 'Unverify' : 'Verify'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Content Moderation */}
        <div>
            <h2 className="text-2xl font-bold mb-4">Content Moderation</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
                                <div className="mt-3" style={{ paddingLeft: '3.25rem' }}> {/* Corresponds to w-10 + space-x-3 */}
                                    <img src={post.imageUrl} alt="Post content" className="rounded-lg max-h-48 w-auto object-cover" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </main>
  );
};

export default AdminView;