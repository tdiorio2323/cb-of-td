import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700">
              We collect information you provide directly to us, such as when you create an
              account, update your profile, or communicate with other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Information</h2>
            <p className="text-gray-700">
              We use the information we collect to provide, maintain, and improve our services,
              to develop new features, and to protect CreatorHub and our users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700">
              We do not share your personal information with companies, organizations, or
              individuals outside of CreatorHub except in the following cases: with your
              consent, for legal reasons, or to protect rights and safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Demo Mode Notice</h2>
            <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
              This is a demonstration application. No real user data is collected or stored.
              All information is mock data for demonstration purposes only.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
