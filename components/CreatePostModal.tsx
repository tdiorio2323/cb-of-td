
import React, { useState, useRef } from 'react';
import { Creator } from '../types';
import { CloseIcon, AddImageIcon } from './icons';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, imageUrl?: string) => void;
  creator: Creator;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, creator }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would upload imageFile to a server and get a URL.
    // For this demo, we'll just use the local preview URL.
    onSubmit(text, imagePreview || undefined);
    setText('');
    setImagePreview(null);
    setImageFile(null);
    onClose();
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(e.target === e.currentTarget) {
        onClose();
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={handleOverlayClick}
    >
      <div className="bg-dark-2 rounded-lg w-full max-w-lg p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-light-3 hover:text-light-1">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-4">Create a new post</h2>
        <div className="flex items-start space-x-4">
          <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What's on your mind, ${creator.name.split(' ')[0]}?`}
            className="w-full bg-dark-3 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[120px]"
          />
        </div>
        {imagePreview && (
          <div className="mt-4 relative">
            <img src={imagePreview} alt="Preview" className="rounded-lg max-h-60 w-full object-cover" />
            <button onClick={() => { setImagePreview(null); setImageFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full text-white">
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <button onClick={() => fileInputRef.current?.click()} className="text-brand-primary hover:text-brand-secondary">
            <AddImageIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() && !imageFile}
            className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full disabled:bg-dark-3 disabled:text-light-3 transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
