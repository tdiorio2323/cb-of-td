import React, { useEffect, useState } from 'react';
import { demoApi } from '@/demo/api';
import { TrendingUp, Users, DollarSign, TrendingDown } from 'lucide-react';

const CreatorAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await demoApi.analytics();
      setAnalytics(data);
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">MRR</span>
            <DollarSign size={20} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${analytics.mrr.toFixed(2)}</div>
          <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp size={14} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Subscribers</span>
            <Users size={20} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalSubscribers}</div>
          <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp size={14} />
            <span>+{analytics.newSubscribers} this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">ARPU</span>
            <DollarSign size={20} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${analytics.arpu.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">Average revenue per user</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Churn Rate</span>
            <TrendingDown size={20} className="text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.churn}%</div>
          <div className="text-sm text-green-600 mt-1">Lower than industry avg</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 30 Days)</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[...Array(30)].map((_, i) => {
            const height = 30 + Math.random() * 70;
            return (
              <div key={i} className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t" style={{ height: `${height}%` }} />
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h2>
        <div className="space-y-4">
          {analytics.topPosts.map((post: any, index: number) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                <div>
                  <p className="font-medium text-gray-900">Post {post.id}</p>
                  <p className="text-sm text-gray-600">{post.views} views • {post.likes} likes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${post.revenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorAnalyticsPage;
