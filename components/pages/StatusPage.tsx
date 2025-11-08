import React from 'react';
import { DEMO_MODE } from '@/config';
import { demoUsers } from '@/demo/demoUser';
import { Check, AlertCircle } from 'lucide-react';

const StatusPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Platform Status</h1>

        <div className="space-y-6">
          {/* Demo Mode Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-4">
              {DEMO_MODE ? (
                <AlertCircle className="text-purple-600 mt-1" size={24} />
              ) : (
                <Check className="text-green-600 mt-1" size={24} />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {DEMO_MODE ? 'Demo Mode Active' : 'Production Mode'}
                </h2>
                <p className="text-gray-700">
                  {DEMO_MODE
                    ? 'This application is running in demonstration mode. No real transactions or data persistence.'
                    : 'Application is running in production mode with real data processing.'}
                </p>
              </div>
            </div>
          </div>

          {/* Demo Personas */}
          {DEMO_MODE && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Demo Personas</h2>
              <div className="space-y-3">
                {Object.entries(demoUsers).map(([role, user]) => (
                  <div key={role} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          @{user.handle} • {user.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Balance</p>
                        <p className="font-semibold text-gray-900">
                          ${user.balance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Services</h2>
            <div className="space-y-3">
              {[
                { name: 'API', status: 'operational' },
                { name: 'Database', status: 'operational' },
                { name: 'File Storage', status: 'operational' },
                { name: 'Messaging', status: 'operational' },
                { name: 'Payment Processing', status: DEMO_MODE ? 'demo' : 'operational' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <span className="text-gray-700">{service.name}</span>
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === 'operational'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {service.status === 'operational' ? 'Operational' : 'Demo Mode'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
