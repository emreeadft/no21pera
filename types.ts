
export interface ModelOption {
  id: string;
  label: string;
  description: string;
}

export interface PoseOption {
  id: string;
  label: string;
}

export interface GenerationResult {
  id: string;
  originalImage: string;
  generatedImage: string;
  timestamp: Date;
  prompt: string;
  ratio: "3:4" | "9:16" | "1:1" | "4:3" | "16:9";
}

export interface AppState {
  isGenerating: boolean;
  selectedModel: string;
  selectedPose: string;
  uploadedImage: string | null;
  results: GenerationResult[];
}
