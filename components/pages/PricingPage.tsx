import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const tiers = [
    {
      name: 'Fan',
      price: 'Free',
      description: 'Discover and support your favorite creators',
      features: [
        'Browse public content',
        'Follow creators',
        'Basic messaging',
        'Subscribe to creators',
      ],
    },
    {
      name: 'Creator',
      price: '$9.99',
      period: '/month',
      description: 'Start monetizing your content',
      features: [
        'Unlimited posts',
        'Custom pricing tiers',
        'Advanced analytics',
        'Direct messaging with fans',
        'PPV content',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Creator Pro',
      price: '$29.99',
      period: '/month',
      description: 'For professional creators',
      features: [
        'Everything in Creator',
        'Advanced revenue analytics',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Early access to features',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your creator journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-2xl shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-purple-600 relative' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  {tier.period && <span className="text-gray-600">{tier.period}</span>}
                </div>
                <p className="text-gray-600">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth/signup"
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
