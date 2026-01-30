
import React from 'react';
import { GenerationResult } from '../types';

interface PreviewProps {
  result: GenerationResult;
  isLatest: boolean;
  onResize: (ratio: "3:4" | "9:16" | "1:1") => void;
}

const Preview: React.FC<PreviewProps> = ({ result, isLatest, onResize }) => {
  const getRatioLabel = (ratio: string) => {
    switch(ratio) {
      case "9:16": return "Story Format";
      case "3:4": return "Post Format (Portrait)";
      case "1:1": return "Square Format";
      default: return ratio;
    }
  };

  return (
    <div className={`group relative bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden ${isLatest ? 'ring-2 ring-stone-900 ring-offset-4' : 'opacity-90 hover:opacity-100 transition-opacity'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Generated Image */}
        <div className={`relative lg:col-span-3 overflow-hidden bg-stone-900 flex items-center justify-center ${result.ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-[3/4]'}`}>
          <img 
            src={result.generatedImage} 
            alt="AI Generated Model" 
            className="w-full h-full object-contain"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-stone-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border border-white/20">
              {getRatioLabel(result.ratio)}
            </span>
          </div>
        </div>

        {/* Controls and Metadata */}
        <div className="lg:col-span-2 p-8 md:p-10 flex flex-col justify-between bg-white border-l border-stone-100">
          <div className="space-y-10">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-2xl font-serif font-bold text-stone-900">Çekim No: #{result.id.slice(-4)}</h4>
                <p className="text-[10px] text-stone-400 font-mono tracking-widest mt-1">
                  {result.timestamp.toLocaleTimeString()} | {result.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3 underline underline-offset-4">Format Dönüştürücü</span>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onResize("9:16")}
                    className={`px-4 py-2.5 rounded-lg text-[11px] font-bold border transition-all ${result.ratio === '9:16' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'}`}
                  >
                    9:16 STORY
                  </button>
                  <button 
                    onClick={() => onResize("3:4")}
                    className={`px-4 py-2.5 rounded-lg text-[11px] font-bold border transition-all ${result.ratio === '3:4' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'}`}
                  >
                    4:5 POST
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3 underline underline-offset-4">Referans Kıyafet</span>
                <div className="w-24 h-24 rounded-2xl border border-stone-100 overflow-hidden bg-stone-50 p-2 group-hover:scale-105 transition-transform">
                  <img src={result.originalImage} alt="Source garment" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Çekim Notları</span>
                <p className="text-stone-500 italic text-xs leading-relaxed">"{result.prompt}"</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3">
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = result.generatedImage;
                link.download = `pera-fabrika-${result.id}.png`;
                link.click();
              }}
              className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Görseli İndir (HD)
            </button>
            <div className="flex gap-2">
               <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                 Paylaş
               </button>
               <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                 Kataloğa Ekle
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
