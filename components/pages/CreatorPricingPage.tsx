import React, { useState } from 'react';
import { DollarSign, Package } from 'lucide-react';

const CreatorPricingPage: React.FC = () => {
  const [monthlyPrice, setMonthlyPrice] = useState('9.99');
  const [ppvDefaultPrice, setPpvDefaultPrice] = useState('5.00');

  const handleSave = () => {
    alert('Pricing updated! (Demo mode - changes not persisted)');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Tiers</h1>

      <div className="space-y-6">
        {/* Monthly Subscription */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Monthly Subscription</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              Recommended: $4.99 - $19.99 per month
            </p>
          </div>
        </div>

        {/* PPV Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Pay-Per-View (PPV) Defaults</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default PPV Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={ppvDefaultPrice}
              onChange={(e) => setPpvDefaultPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              This will be the default price for PPV content. You can adjust per post.
            </p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Tiers (Coming Soon)</h2>
          <p className="text-gray-600 mb-4">
            Create multiple subscription tiers with different benefits and pricing.
          </p>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-not-allowed">
            Create New Tier (Coming Soon)
          </button>
        </div>

        {/* Bundles */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Bundles</h2>
          <p className="text-gray-600 mb-4">
            Offer discounted bundles of your exclusive content.
          </p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Create Bundle
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
          >
            Save Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorPricingPage;
