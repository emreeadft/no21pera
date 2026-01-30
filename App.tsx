
import React, { useState } from 'react';
import { GeminiService } from './services/geminiService';
import { ModelOption, PoseOption, GenerationResult } from './types';
import Header from './components/Header';
import Uploader from './components/Uploader';
import Options from './components/Options';
import Preview from './components/Preview';

const MODEL_TYPES: ModelOption[] = [
  { id: 'elegant-woman', label: 'Zarif Kadın', description: 'Sofistike ve vakur bir görünüm' },
  { id: 'modern-man', label: 'Modern Erkek', description: 'Keskin hatlı ve şık maskülen tarz' },
  { id: 'minimalist-neutral', label: 'Minimalist Nötr', description: 'Sadece kıyafete odaklanan temiz çekim' },
  { id: 'avant-garde', label: 'Avangart Stil', description: 'Yüksek moda ve sanatsal duruş' },
  { id: 'street-fashion', label: 'Sokak Modası', description: 'Genç, dinamik ve kentsel bir hava' },
  { id: 'commercial-bright', label: 'Ticari Parlak', description: 'E-ticaret siteleri için ideal aydınlık çekim' },
];

const POSE_STYLES: PoseOption[] = [
  { id: 'editorial-walking', label: 'Yürüyüş (Editorial)' },
  { id: 'static-classic', label: 'Klasik Ön Poz' },
  { id: 'sitting-sophisticated', label: 'Zarif Oturuş' },
  { id: 'dynamic-side', label: 'Dinamik Yan Poz' },
  { id: 'over-shoulder', label: 'Omuz Üstü Bakış' },
  { id: 'hands-pockets', label: 'Eller Cepte' },
  { id: 'detail-focus', label: 'Detay Odaklı' },
  { id: 'candid-natural', label: 'Doğal/Haberci Pozu' },
];

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_TYPES[0].id);
  const [selectedPose, setSelectedPose] = useState(POSE_STYLES[1].id);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (targetRatio: "3:4" | "9:16" | "1:1" = "3:4", baseImage: string | null = null) => {
    const sourceImage = baseImage || uploadedImage;
    if (!sourceImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      const gemini = GeminiService.getInstance();
      const modelLabel = MODEL_TYPES.find(m => m.id === selectedModel)?.label || 'model';
      const poseLabel = POSE_STYLES.find(p => p.id === selectedPose)?.label || 'pose';
      
      const resultImageUrl = await gemini.generateModelPhoto(
        sourceImage,
        modelLabel,
        poseLabel,
        targetRatio
      );

      const newResult: GenerationResult = {
        id: Date.now().toString(),
        originalImage: sourceImage,
        generatedImage: resultImageUrl,
        timestamp: new Date(),
        prompt: `${modelLabel} in ${poseLabel}`,
        ratio: targetRatio
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      setError('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResize = async (result: GenerationResult, ratio: "3:4" | "9:16" | "1:1") => {
    // We use the already generated image as the base to keep consistency
    await handleGenerate(ratio, result.generatedImage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-xl font-serif font-bold mb-6 text-stone-800">1. Kıyafet Yükle</h2>
              <Uploader onUpload={setUploadedImage} currentImage={uploadedImage} />
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-xl font-serif font-bold mb-6 text-stone-800">2. Estetik ve Poz Seçimi</h2>
              <Options 
                models={MODEL_TYPES} 
                poses={POSE_STYLES} 
                selectedModel={selectedModel}
                selectedPose={selectedPose}
                onSelectModel={setSelectedModel}
                onSelectPose={setSelectedPose}
              />
            </section>

            <button
              onClick={() => handleGenerate("3:4")}
              disabled={!uploadedImage || isGenerating}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                !uploadedImage || isGenerating
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-white hover:bg-stone-800 transform hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yaratılıyor...
                </span>
              ) : (
                'Stüdyo Çekimi Başlat (850x1250)'
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            {isGenerating && (
              <div className="aspect-[3/4] bg-stone-100 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-stone-200 overflow-hidden animate-pulse">
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif text-stone-500 font-bold uppercase tracking-widest">Görüntü İşleniyor</h3>
                  <p className="text-stone-400 max-w-xs mx-auto text-sm">Kumaş dokusu, model duruşu ve stüdyo ambiyansı optimize ediliyor...</p>
                </div>
              </div>
            )}

            {!isGenerating && results.length === 0 && (
              <div className="aspect-[3/4] bg-stone-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-stone-200 text-stone-400">
                <p className="text-center font-serif text-lg italic">no:21pera fabrika stüdyosuna hoş geldiniz.</p>
                <p className="text-xs mt-2 uppercase tracking-widest">Başlamak için bir görsel yükleyin</p>
              </div>
            )}

            {results.length > 0 && !isGenerating && (
              <div className="space-y-12">
                <Preview 
                  result={results[0]} 
                  isLatest={true} 
                  onResize={(ratio) => handleResize(results[0], ratio)}
                />
                
                {results.length > 1 && (
                  <div className="pt-12 border-t border-stone-100">
                    <h3 className="text-2xl font-serif font-bold mb-8 text-stone-800">Arşivlenen Çekimler</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {results.slice(1).map(result => (
                        <Preview key={result.id} result={result} isLatest={false} onResize={(ratio) => handleResize(result, ratio)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 bg-stone-50 border-t border-stone-200">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif italic text-stone-500">no:21pera fabrika — Profesyonel Butik Çözümleri</p>
          <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-[0.2em]">Pera Digital Studio © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
