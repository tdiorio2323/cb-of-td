import React from 'react';
import { Package, Plus } from 'lucide-react';

const CreatorShopPage: React.FC = () => {
  const products = [
    { id: '1', name: 'Exclusive Photo Set - Summer 2025', price: 15.99, type: 'PPV', sales: 42 },
    { id: '2', name: 'Behind the Scenes Video', price: 9.99, type: 'PPV', sales: 67 },
    { id: '3', name: 'Tutorial Bundle', price: 24.99, type: 'Bundle', sales: 18 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shop & PPV Content</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400" />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {product.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                <span className="text-sm text-gray-600">{product.sales} sales</span>
              </div>
              <button className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Edit Product
              </button>
            </div>
          </div>
        ))}

        {/* Add New Product Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-dashed border-gray-300 hover:border-purple-600 transition-colors cursor-pointer">
          <div className="aspect-video bg-gray-50 flex items-center justify-center">
            <Plus size={48} className="text-gray-400" />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold text-gray-900 mb-1">Add New Product</h3>
            <p className="text-sm text-gray-600">Create PPV content or bundles</p>
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">127</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$1,842.83</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Average Order Value</p>
            <p className="text-2xl font-bold text-gray-900">$14.51</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorShopPage;
