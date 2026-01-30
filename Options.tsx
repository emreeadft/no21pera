
import React from 'react';
import { ModelOption, PoseOption } from '../types';

interface OptionsProps {
  models: ModelOption[];
  poses: PoseOption[];
  selectedModel: string;
  selectedPose: string;
  onSelectModel: (id: string) => void;
  onSelectPose: (id: string) => void;
}

const Options: React.FC<OptionsProps> = ({ 
  models, 
  poses, 
  selectedModel, 
  selectedPose, 
  onSelectModel, 
  onSelectPose 
}) => {
  return (
    <div className="space-y-10">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-5 border-b border-stone-100 pb-2">Model Kimliği</label>
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-200 ${
                selectedModel === model.id 
                  ? 'border-stone-900 bg-stone-900 text-white shadow-md' 
                  : 'border-stone-200 hover:border-stone-400 bg-white text-stone-600'
              }`}
            >
              <div className="font-bold text-sm tracking-tight">{model.label}</div>
              <div className={`text-[10px] mt-0.5 opacity-60`}>
                {model.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-5 border-b border-stone-100 pb-2">Pose Kataloğu</label>
        <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {poses.map(pose => (
            <button
              key={pose.id}
              onClick={() => onSelectPose(pose.id)}
              className={`px-3 py-4 text-[10px] font-bold rounded-xl border transition-all duration-200 text-center uppercase tracking-wider ${
                selectedPose === pose.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {pose.label}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default Options;
