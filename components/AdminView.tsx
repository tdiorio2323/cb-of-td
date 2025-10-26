import React from 'react';
import { User } from '../types';
import { usePlatformData } from '../hooks/usePlatformData';
import { VerifiedIcon, UnverifiedIcon, DeleteIcon } from './icons';
import PostCard from './PostCard';

interface AdminViewProps {
  currentUser: User;
}

const AdminView: React.FC<AdminViewProps> = ({ currentUser }) => {
  const { 
    creators, 
    posts,
    users, 
    toggleCreatorVerification,
    removePost,
    getCreatorById,
    } = usePlatformData();

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
            <div className="bg-dark-2 rounded-lg overflow-hidden">
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
                {posts.map(post => (
                    <div key={post.id} className="bg-dark-2 p-4 rounded-lg flex justify-between items-start">
                        <div>
                            <p className="text-sm text-light-3">@{getCreatorById(post.creatorId)?.handle}</p>
                            <p className="mt-1 text-light-1">{post.text.substring(0, 100)}{post.text.length > 100 && '...'}</p>
                        </div>
                        <button onClick={() => removePost(post.id)} className="ml-4 text-light-3 hover:text-red-500 p-2 rounded-full flex-shrink-0">
                           <DeleteIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  );
};

export default AdminView;
