import React, { useState, useEffect } from 'react';
import { impersonate, getCurrentDemoUser } from '@/state/demoAuth';
import { DemoRole } from '@/demo/demoUser';
import { User, Settings } from 'lucide-react';

const DemoSwitcher: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<DemoRole>('fan');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentDemoUser();
    if (user) {
      setCurrentRole(user.role as DemoRole);
    }

    const handlePersonaChange = () => {
      const user = getCurrentDemoUser();
      if (user) {
        setCurrentRole(user.role as DemoRole);
        // Force a full page reload to reset all state
        window.location.reload();
      }
    };

    window.addEventListener('demo-persona-change', handlePersonaChange);
    return () => window.removeEventListener('demo-persona-change', handlePersonaChange);
  }, []);

  const handleSwitch = (role: DemoRole) => {
    impersonate(role);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Settings size={16} />
          <span className="font-medium capitalize">{currentRole}</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[200px]">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase">Switch Persona</p>
            </div>

            <button
              onClick={() => handleSwitch('fan')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-50 transition-colors ${
                currentRole === 'fan' ? 'bg-purple-100' : ''
              }`}
            >
              <User size={18} className="text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Fan</p>
                <p className="text-xs text-gray-500">Ava • $125.00</p>
              </div>
            </button>

            <button
              onClick={() => handleSwitch('creator')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-pink-50 transition-colors ${
                currentRole === 'creator' ? 'bg-pink-100' : ''
              }`}
            >
              <User size={18} className="text-pink-600" />
              <div>
                <p className="font-medium text-gray-900">Creator</p>
                <p className="text-xs text-gray-500">Mila • 486 subs</p>
              </div>
            </button>

            <button
              onClick={() => handleSwitch('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                currentRole === 'admin' ? 'bg-blue-100' : ''
              }`}
            >
              <User size={18} className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Ops • Platform</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoSwitcher;
