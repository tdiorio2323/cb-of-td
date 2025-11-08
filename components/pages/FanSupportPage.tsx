import React from 'react';
import { HelpCircle, Mail, MessageCircle, BookOpen } from 'lucide-react';

const FanSupportPage: React.FC = () => {
  const faqs = [
    {
      question: 'How do I subscribe to a creator?',
      answer:
        'Visit the creator\'s profile, click the "Subscribe" button, and complete the payment process.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer:
        'Go to Settings > Subscriptions, find the subscription you want to cancel, and click "Cancel Subscription".',
    },
    {
      question: 'Can I get a refund?',
      answer:
        'Refund policies vary by creator. Contact support with your receipt for assistance.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Mail size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-3">Get help via email</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            support@creatorhub.com
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <MessageCircle size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-3">Chat with our team</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <BookOpen size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
          <p className="text-sm text-gray-600 mb-3">Browse our guides</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">View Docs</button>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>Demo Mode:</strong> In a production environment, these support options would
          connect to real support channels.
        </p>
      </div>
    </div>
  );
};

export default FanSupportPage;
