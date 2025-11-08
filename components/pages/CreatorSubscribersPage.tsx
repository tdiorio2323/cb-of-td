import React from 'react';
import { Users, Mail, Filter } from 'lucide-react';

const CreatorSubscribersPage: React.FC = () => {
  const subscribers = [
    { id: '1', name: 'Ava', handle: 'fan_demo', since: '2025-01-01', tier: 'Standard', status: 'active' },
    { id: '2', name: 'John', handle: 'john_doe', since: '2024-12-15', tier: 'Standard', status: 'active' },
    { id: '3', name: 'Sarah', handle: 'sarah_smith', since: '2024-12-20', tier: 'Standard', status: 'active' },
    { id: '4', name: 'Mike', handle: 'mike_jones', since: '2024-11-10', tier: 'Standard', status: 'paused' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Mail size={18} />
            Message All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-purple-600" />
            <span className="text-gray-600">Total Subscribers</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">486</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-green-600" />
            <span className="text-gray-600">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">462</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-yellow-600" />
            <span className="text-gray-600">Paused</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">24</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-blue-600" />
            <span className="text-gray-600">New (30d)</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">48</div>
        </div>
      </div>

      {/* Subscriber List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Subscriber</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Member Since</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Tier</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{subscriber.name}</div>
                    <div className="text-sm text-gray-600">@{subscriber.handle}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(subscriber.since).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-700">{subscriber.tier}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      subscriber.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {subscriber.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreatorSubscribersPage;
