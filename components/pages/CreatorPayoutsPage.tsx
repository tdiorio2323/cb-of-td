import React, { useEffect, useState } from 'react';
import { demoApi } from '@/demo/api';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

const CreatorPayoutsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayouts = async () => {
      const data = await demoApi.payouts();
      setTransactions(data);
      setLoading(false);
    };
    loadPayouts();
  }, []);

  const balance = 4820.50;
  const pendingBalance = 1240.00;
  const nextPayout = '2025-01-15';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading payouts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payouts</h1>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={24} />
            <span className="text-purple-100">Available Balance</span>
          </div>
          <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
          <button className="mt-4 w-full px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
            Request Payout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-purple-600" />
            <span className="text-gray-600">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${pendingBalance.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-2">Processing</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={20} className="text-purple-600" />
            <span className="text-gray-600">Next Payout</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {new Date(nextPayout).toLocaleDateString()}
          </div>
          <p className="text-sm text-gray-500 mt-2">Automatic transfer</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Payout History</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Type</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Description</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">
                  {new Date(txn.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                    {txn.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{txn.description}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  +${txn.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>Demo Mode:</strong> All payout information is mock data. No real transactions are processed.
        </p>
      </div>
    </div>
  );
};

export default CreatorPayoutsPage;
