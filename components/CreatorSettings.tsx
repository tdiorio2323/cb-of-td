import React, { useState } from 'react';
import { Creator } from '../types';
import { usePlatform } from '../App';
import { Save } from 'lucide-react';

// --- PROPS ---
interface CreatorSettingsProps {
  creator: Creator;
}

export default function CreatorSettings({ creator }: CreatorSettingsProps) {
  const { updateCreatorProfile } = usePlatform();

  // --- Form State ---
  // Initialize the form state with the creator's current data
  const [bio, setBio] = useState(creator.bio);
  const [avatarUrl, setAvatarUrl] = useState(creator.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(creator.bannerUrl);
  const [subscriptionPrice, setSubscriptionPrice] = useState(
    creator.subscriptionPrice
  );
  const [accessCode, setAccessCode] = useState(creator.accessCode);

  const [saveStatus, setSaveStatus] = useState('');

  // --- Event Handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the partial Creator object with the updated data
    const updatedProfile: Partial<Creator> = {
      bio,
      avatarUrl,
      bannerUrl,
      subscriptionPrice: Number(subscriptionPrice), // Ensure it's a number
      accessCode: accessCode.toUpperCase(), // Standardize access code
    };

    // Call the function from our hook
    updateCreatorProfile(creator.id, updatedProfile);

    // Show a success message
    setSaveStatus('Profile updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000); // Clear message after 3 sec
  };

  // --- RENDER ---
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Creator Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700"
      >
        {/* Profile Settings */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Profile</h3>
          <div className="space-y-4">
            <FormInput
              label="Bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              as="textarea"
            />
            <FormInput
              label="Avatar URL"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
            <FormInput
              label="Banner URL"
              id="bannerUrl"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* Subscription Settings */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Subscription
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Subscription Price ($)"
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={subscriptionPrice.toString()}
              onChange={(e) =>
                setSubscriptionPrice(parseFloat(e.target.value))
              }
            />
            <FormInput
              label="Access Code"
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end items-center gap-4">
          {saveStatus && (
            <p className="text-green-400 text-sm">{saveStatus}</p>
          )}
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-purple-500 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Helper Component for Form Inputs ---

interface FormInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  as?: 'input' | 'textarea';
  [key: string]: any; // Allow other props like 'type', 'min', etc.
}

function FormInput({
  label,
  id,
  value,
  onChange,
  as = 'input',
  ...props
}: FormInputProps) {
  const commonClasses =
    'w-full bg-gray-700 text-white p-2 mt-1 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={4}
          className={commonClasses}
          {...props}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          className={commonClasses}
          {...props}
        />
      )}
    </div>
  );
}