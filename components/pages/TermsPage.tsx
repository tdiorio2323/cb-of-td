import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using CreatorHub, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-2">
              Permission is granted to temporarily download one copy of the materials on
              CreatorHub's website for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-gray-700">
              This is the grant of a license, not a transfer of title, and under this license
              you may not modify or copy the materials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Content Guidelines</h2>
            <p className="text-gray-700">
              Users must not upload content that is illegal, harmful, threatening, abusive,
              harassing, defamatory, vulgar, obscene, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Demo Mode Notice</h2>
            <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
              This is a demonstration application. No real transactions or purchases are
              processed. All data is mock and for demonstration purposes only.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
