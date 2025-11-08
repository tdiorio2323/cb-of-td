import React, { useEffect, useState } from 'react';
import { Creator } from '@/types';
import { demoApi } from '@/demo/api';
import { Link } from 'react-router-dom';
import { Users, Heart } from 'lucide-react';

const ExplorePage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreators = async () => {
      const data = await demoApi.creators(12);
      setCreators(data);
      setLoading(false);
    };
    loadCreators();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading creators...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Creators</h1>
          <p className="text-gray-600">Discover amazing content creators on CreatorHub</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              to={`/@${creator.handle}`}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400">
                {creator.bannerImage && (
                  <img
                    src={creator.bannerImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                    {creator.avatar && (
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                    <p className="text-sm text-gray-500">@{creator.handle}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{creator.bio}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{creator.subscribers}</span>
                  </div>
                  <div className="font-semibold text-purple-600">
                    ${creator.monthlyPrice}/mo
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
