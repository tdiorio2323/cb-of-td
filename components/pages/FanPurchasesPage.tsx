import React from 'react';
import { Download, FileText } from 'lucide-react';

const FanPurchasesPage: React.FC = () => {
  const purchases = [
    {
      id: '1',
      item: 'Exclusive Photo Set - Summer Vibes',
      creator: 'Mila',
      amount: 15.99,
      date: '2025-01-05',
      status: 'completed',
    },
    {
      id: '2',
      item: 'PPV Video - Behind the Scenes',
      creator: 'Sofia',
      amount: 9.99,
      date: '2025-01-03',
      status: 'completed',
    },
    {
      id: '3',
      item: 'Monthly Subscription',
      creator: 'Emma',
      amount: 12.99,
      date: '2025-01-01',
      status: 'completed',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
        <button className="text-purple-600 hover:text-purple-700 font-medium">
          Download All Receipts
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Item</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Creator</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{purchase.item}</div>
                  <div className="text-sm text-gray-500">Order #{purchase.id}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{purchase.creator}</td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(purchase.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">
                  ${purchase.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <FileText size={18} />
                    </button>
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>Demo Mode:</strong> All purchases shown are mock data. No real transactions have been processed.
        </p>
      </div>
    </div>
  );
};

export default FanPurchasesPage;
