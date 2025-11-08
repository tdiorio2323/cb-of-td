import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const DemoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">
            <strong>Demo Mode Active</strong> — No real purchases or messages. All data is for demonstration purposes.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
