
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

export const analyzeEntry = async (content: string): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    return { mood: 'Reflective', tags: ['journal'], summary: 'Analysis unavailable without API Key.' };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this journal entry and return a JSON object with mood, relevant tags (max 3), and a one-sentence summary: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING, description: "The primary mood of the entry." },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "A few keywords related to the text."
            },
            summary: { type: Type.STRING, description: "Short summary." }
          },
          required: ["mood", "tags", "summary"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { mood: 'Reflective', tags: ['personal'], summary: 'Could not analyze content.' };
  }
};
