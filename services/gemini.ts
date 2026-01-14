import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key, handling browser environments where process is undefined
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    console.warn("Unable to access process.env");
  }
  return '';
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

try {
    // Initialize AI only if key is present to prevent startup crashes
    if (apiKey) {
       ai = new GoogleGenAI({ apiKey });
    } else {
       console.warn("Gemini API Key is missing. AI features will be disabled.");
    }
} catch (error) {
    console.error("Error initializing Gemini client:", error);
}

export const getNutritionAdvice = async (query: string, language: 'en' | 'hi'): Promise<string> => {
  if (!ai) {
      if (!apiKey) return "API Key is missing. Please configure process.env.API_KEY.";
      return "AI Client initialization failed. Please reload.";
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