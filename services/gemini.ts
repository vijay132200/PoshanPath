import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // Check env var (replaced by Vite during build) or localStorage
  // Note: Vite replaces 'process.env.API_KEY' with the actual string value
  // We added a hardcoded fallback key as requested to ensure the app works immediately.
  const key = process.env.API_KEY || 
              (typeof localStorage !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null) || 
              "AIzaSyCWJvzsJk7w_XBgLnDLZ9Te1_au09LvTxY";
  
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export const getNutritionAdvice = async (query: string, language: 'en' | 'hi'): Promise<string> => {
  const ai = getClient();

  if (!ai) {
    console.error("Gemini API Key is missing.");
    return "Configuration Error: API Key is missing. Please set API_KEY in env or add ?key=YOUR_KEY to the URL.";
  }

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