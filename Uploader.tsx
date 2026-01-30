
import React, { useRef } from 'react';

interface UploaderProps {
  onUpload: (base64: string) => void;
  currentImage: string | null;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={handleContainerClick}
        className={`relative aspect-square rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 ${
          currentImage ? 'border-stone-400' : 'border-stone-200 hover:border-stone-400 bg-stone-50'
        }`}
      >
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Uploaded garment" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center space-y-3">
            <svg className="mx-auto h-12 w-12 text-stone-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-stone-500 font-medium">Click to upload garment</div>
            <p className="text-xs text-stone-400">PNG, JPG up to 10MB</p>
          </div>
        )}
        
        {currentImage && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Change Image</span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/*"
      />
      
      <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest leading-relaxed">
        For best results, use a high-quality photo of the garment on a flat surface or mannequin.
      </p>
    </div>
  );
};

export default Uploader;
