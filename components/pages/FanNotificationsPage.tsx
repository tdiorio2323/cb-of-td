import React, { useEffect, useState } from 'react';
import { demoApi } from '@/demo/api';
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const FanNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await demoApi.notifications();
      setNotifications(data);
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />;
      case 'message':
        return <MessageCircle size={20} className="text-blue-500" />;
      case 'subscription':
        return <Bell size={20} className="text-purple-500" />;
      default:
        return <UserPlus size={20} className="text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg p-4 shadow-sm ${
              !notification.read ? 'border-l-4 border-purple-600' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <p className="text-gray-900">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FanNotificationsPage;
