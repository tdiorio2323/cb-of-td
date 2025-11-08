import React from 'react';
import { BarChart3, Users, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

const AdminReportsPage: React.FC = () => {
  const kpis = [
    { label: 'Total Users', value: '12,483', change: '+8.2%', icon: Users, color: 'blue' },
    { label: 'Active Creators', value: '1,247', change: '+12.5%', icon: Users, color: 'purple' },
    { label: 'Platform Revenue', value: '$124,830', change: '+15.3%', icon: DollarSign, color: 'green' },
    { label: 'Abuse Reports', value: '23', change: '-5.1%', icon: AlertCircle, color: 'red' },
  ];

  const recentReports = [
    { id: '1', type: 'Content', reported: 'Post #12345', reason: 'Inappropriate content', status: 'pending' },
    { id: '2', type: 'User', reported: '@user123', reason: 'Spam', status: 'resolved' },
    { id: '3', type: 'Payment', reported: 'Transaction #456', reason: 'Chargeback', status: 'pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Reports</h1>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change.startsWith('+');

          return (
            <div key={kpi.label} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">{kpi.label}</span>
                <Icon size={20} className={`text-${kpi.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              <div
                className={`text-sm flex items-center gap-1 mt-1 ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <TrendingUp size={14} />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Platform Activity</h2>
        </div>

        <div className="h-64 flex items-end justify-between gap-2">
          {[...Array(12)].map((_, i) => {
            const height = 30 + Math.random() * 70;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <span>Jan</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Abuse Reports</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Type</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Reported</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Reason</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{report.reported}</td>
                <td className="px-6 py-4 text-gray-700">{report.reason}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>Demo Mode:</strong> All reports and KPIs are mock data for demonstration purposes.
        </p>
      </div>
    </div>
  );
};

export default AdminReportsPage;
