import React, { useState } from 'react';
import { Upload, Image, Video, File, Trash2 } from 'lucide-react';

const CreatorLibraryPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const mockFiles = [
    { id: '1', name: 'summer-photoshoot-1.jpg', type: 'image', size: '2.4 MB', date: '2025-01-05' },
    { id: '2', name: 'behind-scenes.mp4', type: 'video', size: '45.8 MB', date: '2025-01-04' },
    { id: '3', name: 'exclusive-content.jpg', type: 'image', size: '3.1 MB', date: '2025-01-03' },
    { id: '4', name: 'tutorial-video.mp4', type: 'video', size: '67.2 MB', date: '2025-01-02' },
  ];

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('File uploaded! (Demo mode - file not actually uploaded)');
    }, 2000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={20} className="text-blue-600" />;
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          <Upload size={18} />
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {/* Storage Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">Storage Used</span>
          <span className="text-gray-900 font-semibold">118 MB / 10 GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '1.18%' }} />
        </div>
      </div>

      {/* File Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Type</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Size</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getIcon(file.type)}
                    <span className="font-medium text-gray-900">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 capitalize">{file.type}</td>
                <td className="px-6 py-4 text-gray-700">{file.size}</td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(file.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreatorLibraryPage;
