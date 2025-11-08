import React, { useEffect, useState } from 'react';
import { Creator } from '@/types';
import { demoApi } from '@/demo/api';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign } from 'lucide-react';

const FanSubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      // In a real app, this would fetch user's active subscriptions
      const creators = await demoApi.creators(4);
      setSubscriptions(creators);
      setLoading(false);
    };
    loadSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Subscriptions</h1>

      <div className="grid gap-4">
        {subscriptions.map((creator) => (
          <div key={creator.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                  {creator.avatar && (
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{creator.name}</h3>
                  <p className="text-gray-600">@{creator.handle}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>${creator.monthlyPrice}/month</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Renews Jan 15, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to={`/@${creator.handle}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You don't have any active subscriptions yet.</p>
          <Link
            to="/fan/discover"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            Discover Creators
          </Link>
        </div>
      )}
    </div>
  );
};

export default FanSubscriptionsPage;
