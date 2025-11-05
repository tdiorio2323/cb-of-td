import React, { useState } from 'react';
import { usePlatform } from '../../App';
import { Save } from 'lucide-react';

const FanSettingsPage: React.FC = () => {
  const { users, updateUserProfile } = usePlatform();

  // Get current fan user
  const currentUser = users.find(u => u.role === 'fan') || users[0];

  // Form state
  const [name, setName] = useState(currentUser.name);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [bio, setBio] = useState(currentUser.bio || '');

  const [saveStatus, setSaveStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile = {
      name,
      avatarUrl,
      bio,
    };

    updateUserProfile(currentUser.id, updatedProfile);

    setSaveStatus('Profile updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Profile Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700"
      >
        {/* Profile Settings */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Edit Your Profile</h3>
          <div className="space-y-4">
            <FormInput
              label="Display Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
            />
            <FormInput
              label="Avatar URL"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <FormInput
              label="Bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              as="textarea"
              placeholder="Tell creators a bit about yourself..."
            />
          </div>
        </div>

        {/* Avatar Preview */}
        {avatarUrl && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Avatar Preview</h4>
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/200';
              }}
            />
          </div>
        )}

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
};

export default FanSettingsPage;

// --- Helper Component for Form Inputs ---

interface FormInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  as?: 'input' | 'textarea';
  placeholder?: string;
  [key: string]: any;
}

function FormInput({
  label,
  id,
  value,
  onChange,
  as = 'input',
  placeholder,
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
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          className={commonClasses}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
}
