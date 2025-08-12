
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

export const analyzeSpeed = async (download: number, upload: number): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Could not analyze speed.";
  }
  
  const prompt = `Based on a download speed of ${download.toFixed(2)} Mbps and an upload speed of ${upload.toFixed(2)} Mbps, provide a brief, one-sentence, user-friendly summary of what this internet speed is good for. Example: 'Your connection is solid for streaming HD videos, browsing, and video calls.' Do not repeat the speeds in your answer. Keep the tone encouraging.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing speed:", error);
    return "Could not analyze speed at this time. Please try again later.";
  }
};
