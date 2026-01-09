
import { GoogleGenAI, Type } from "@google/genai";

export const getCreativeTeamNames = async (count: number): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} creative, funny, or professional team names for an office group activity. Return only the names separated by commas.`,
      config: {
        temperature: 0.8,
      }
    });
    
    const text = response.text?.trim();
    if (text) {
      return text.split(',').map(name => name.trim().replace(/^["']|["']$/g, '')).slice(0, count);
    }
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};
