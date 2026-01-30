
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async generateModelPhoto(
    base64Image: string,
    modelType: string,
    poseStyle: string,
    aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "3:4"
  ): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `
      High-end professional fashion photography.
      The model persona is ${modelType}.
      The model is posing in a ${poseStyle} style.
      The model must be wearing the clothing item from the attached image.
      
      Environment: Professional boutique studio, soft neutral background, cinematic lighting.
      Quality: 8K resolution, realistic fabric textures, perfect lighting integration.
      No text, no watermarks. Focus on a clean, luxury fashion aesthetic.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanedBase64,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        }
      });

      let generatedImageUrl = '';
      
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!generatedImageUrl) {
        throw new Error('Görsel oluşturulamadı.');
      }

      return generatedImageUrl;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}
