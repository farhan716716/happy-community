import React from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in duration-150">
      {/* Header */}
      <div className="w-full flex items-center justify-between text-white/80 py-2 px-4 max-w-4xl">
        <span className="text-sm font-medium">Photo View</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert("Downloading photo attachment...")}
            className="p-1 hover:text-white" 
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-1 hover:text-white" title="Close">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Image Center */}
      <div className="flex-1 flex items-center justify-center p-2 max-w-4xl max-h-[85vh] w-full">
        <img
          src={imageUrl}
          alt="Preview"
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Footer */}
      <div className="py-2 text-white/50 text-xs">
        Click background or close button to exit
      </div>
    </div>
  );
};
