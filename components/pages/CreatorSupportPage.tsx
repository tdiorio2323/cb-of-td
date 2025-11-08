import React from 'react';
import { HelpCircle, Mail, MessageCircle, BookOpen, FileText } from 'lucide-react';

const CreatorSupportPage: React.FC = () => {
  const resources = [
    { title: 'Getting Started Guide', category: 'Basics', icon: BookOpen },
    { title: 'Setting Your Pricing', category: 'Monetization', icon: FileText },
    { title: 'Growing Your Audience', category: 'Marketing', icon: FileText },
    { title: 'Content Best Practices', category: 'Content', icon: FileText },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Creator Support</h1>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Mail size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-3">Priority response for creators</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            creators@creatorhub.com
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <MessageCircle size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-3">Chat with creator success team</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <BookOpen size={32} className="text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Creator Academy</h3>
          <p className="text-sm text-gray-600 mb-3">Courses and tutorials</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            View Courses
          </button>
        </div>
      </div>

      {/* Help Resources */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Popular Resources</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <resource.icon size={20} className="text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Ticket */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit a Support Ticket</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Brief description of your issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
              <option>Technical Issue</option>
              <option>Payment Question</option>
              <option>Account Help</option>
              <option>Feature Request</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Please provide as much detail as possible..."
            />
          </div>

          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium">
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSupportPage;
