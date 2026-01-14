import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getNutritionAdvice = async (query: string, language: 'en' | 'hi'): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  const systemInstruction = `You are 'Poshan Didi', a friendly and knowledgeable community health assistant for rural India. 
  Your goal is to provide simple, actionable nutrition advice for parents of young children (0-5 years).
  
  Guidelines:
  1. Language: Reply in a mix of English and simple Hindi (Hinglish) if the language is 'hi', or simple English if 'en'.
  2. Tone: Encouraging, respectful (use 'ji'), and easy to understand (avoid complex medical jargon).
  3. Content: Focus on locally available foods (dal, spinach, milk, roti, eggs).
  4. Context: The user is asking about child nutrition.
  
  Current user language preference: ${language}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "Sorry, I could not understand. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Network error. Please try again later.";
  }
};