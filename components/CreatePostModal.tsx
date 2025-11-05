

import React, { useState, useRef, useEffect } from 'react';
import { Creator, Post } from '../types';
import { CloseIcon, AddImageIcon, SparklesIcon } from './icons';
import { generatePostDraft } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; imageUrl: string | undefined; isPrivate: boolean; postId?: string }) => void;
  creator: Creator;
  postToEdit?: Post | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, creator, postToEdit }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPrompt, setShowAiPrompt] = useState(false);

  const isEditing = !!postToEdit;

  useEffect(() => {
    if (isOpen && postToEdit) {
      setText(postToEdit.text);
      setImagePreview(postToEdit.imageUrl || null);
      setIsPrivate(postToEdit.isPrivate);
      setImageFile(null); // Can't reconstruct the file object, user must re-select to change
    } else {
      // Reset for create mode or when modal is closed
      setText('');
      setImagePreview(null);
      setImageFile(null);
      setIsPrivate(false);
    }
  }, [isOpen, postToEdit]);

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
    onSubmit({
      text,
      imageUrl: imagePreview || undefined,
      isPrivate,
      postId: postToEdit?.id
    });
    onClose();
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(e.target === e.currentTarget) {
        onClose();
    }
  }
  
  const handleGeneratePost = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const draft = await generatePostDraft(aiPrompt);
    setText(draft);
    setIsGenerating(false);
    setShowAiPrompt(false);
    setAiPrompt('');
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={handleOverlayClick}
    >
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg w-full max-w-lg p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-light-3 hover:text-light-1">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Post' : 'Create a new post'}</h2>
        <div className="flex items-start space-x-4">
          <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What's on your mind, ${creator.name.split(' ')[0]}?`}
            className="w-full backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[120px]"
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
         {showAiPrompt && (
          <div className="mt-4 space-y-2 animate-fade-in-up">
            <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A post about my upcoming trip to Japan..."
                className="w-full backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-lg text-light-1 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                rows={2}
            />
            <button
                onClick={handleGeneratePost}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full backdrop-blur-md bg-white/5 border border-white/10 text-brand-primary font-bold py-2 px-4 rounded-full disabled:opacity-50 transition-colors hover:bg-white/10"
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                 <button onClick={() => fileInputRef.current?.click()} className="text-brand-primary hover:text-brand-secondary p-2 rounded-full hover:bg-white/10 transition-colors">
                    <AddImageIcon />
                </button>
                 <button onClick={() => setShowAiPrompt(!showAiPrompt)} className="text-brand-primary hover:text-brand-secondary p-2 rounded-full hover:bg-white/10 transition-colors">
                    <SparklesIcon />
                </button>
                <label htmlFor="private-toggle" className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                        <input type="checkbox" id="private-toggle" className="sr-only" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
                        <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${isPrivate ? 'bg-brand-primary' : 'bg-dark-3'}`}></div>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="ml-3 text-light-2 text-sm">Subscribers Only</span>
                </label>
            </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() && !imageFile && !imagePreview}
            className="bg-brand-primary text-dark-1 font-bold py-2 px-6 rounded-full disabled:bg-dark-3 disabled:text-light-3 transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;