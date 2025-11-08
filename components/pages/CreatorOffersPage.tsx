import React from 'react';
import { Tag, Percent, Gift } from 'lucide-react';

const CreatorOffersPage: React.FC = () => {
  const offers = [
    { id: '1', name: 'Welcome Discount', code: 'WELCOME20', discount: '20%', uses: 45, maxUses: 100, active: true },
    { id: '2', name: 'Summer Sale', code: 'SUMMER50', discount: '50%', uses: 128, maxUses: 200, active: true },
    { id: '3', name: 'VIP Trial', code: 'VIP7DAY', discount: '7 days free', uses: 23, maxUses: 50, active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Offers & Promotions</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow">
          Create New Offer
        </button>
      </div>

      {/* Offer Types */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Percent size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Percentage Discounts</h3>
          <p className="text-sm text-gray-600">Offer % off subscriptions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Tag size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Promo Codes</h3>
          <p className="text-sm text-gray-600">Custom coupon codes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Gift size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Free Trials</h3>
          <p className="text-sm text-gray-600">Limited time access</p>
        </div>
      </div>

      {/* Active Offers */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Active Offers</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Code</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Discount</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Uses</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{offer.name}</td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-purple-50 text-purple-700 rounded font-mono text-sm">
                    {offer.code}
                  </code>
                </td>
                <td className="px-6 py-4 text-gray-700">{offer.discount}</td>
                <td className="px-6 py-4 text-gray-700">
                  {offer.uses} / {offer.maxUses}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      offer.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {offer.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    Edit
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

export default CreatorOffersPage;
