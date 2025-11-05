import React from 'react';
import { usePlatform } from '../App';
import { Users, FileText, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { users, creators, posts } = usePlatform();

  // --- 1. Fetch Platform Stats ---
  const totalUsers = users.length;
  const totalCreators = creators.length;
  const totalPosts = posts.length;

  // --- 2. Render Stats Cards ---
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Users"
          value={totalUsers.toString()}
          icon={<Users size={24} className="text-blue-400" />}
        />
        <StatCard
          label="Total Creators"
          value={totalCreators.toString()}
          icon={<UserCheck size={24} className="text-purple-400" />}
        />
        <StatCard
          label="Total Posts"
          value={totalPosts.toString()}
          icon={<FileText size={24} className="text-green-400" />}
        />
      </div>

      {/* We could add charts or other data visualizations here later */}
    </div>
  );
}

// --- Helper Component for Stat Cards ---

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-dark-2 p-6 rounded-lg border border-dark-3 flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-dark-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-light-3 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
