import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';

const CreatorOnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Complete Profile',
      description: 'Add your bio, avatar, and banner image',
      completed: true,
    },
    {
      title: 'Set Pricing',
      description: 'Choose your subscription and PPV pricing',
      completed: true,
    },
    {
      title: 'Verification',
      description: 'Verify your identity to start earning',
      completed: false,
    },
    {
      title: 'First Post',
      description: 'Create your first exclusive post',
      completed: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to CreatorHub!</h1>
        <p className="text-lg text-gray-600">
          Let's get your creator account set up in just a few steps.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-green-600 text-white'
                    : index === currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? <Check size={16} /> : <span>{index + 1}</span>}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {index === currentStep && !step.completed && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Complete Step
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              <div>
                {step.completed && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Tips</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Post regularly to keep your subscribers engaged</li>
          <li>• Respond to messages to build a strong community</li>
          <li>• Use PPV content for premium, exclusive material</li>
          <li>• Check your analytics to understand what content performs best</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatorOnboardingPage;
