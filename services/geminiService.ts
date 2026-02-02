import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DevotionalResponse } from '../types';

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing in environment variables.");
    return "";
  }
  return key;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateDevotional = async (topic: string): Promise<DevotionalResponse> => {
  const prompt = `You are an AI spiritual companion speaking in a formal pastoral tone. Ground guidance in the provided scriptures and return ONLY a JSON object that matches the DevotionalResponseV1 schema: title, empathy, scripture, wisdom, action, prayer. Aim for ~50 words total (allow 30-80). Do not fabricate scripture citations. The user's input: "${topic}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short formal title" },
            empathy: { type: Type.STRING, description: "Formal empathetic opening" },
            scripture: { type: Type.STRING, description: "Bible verse and reference" },
            wisdom: { type: Type.STRING, description: "Concise pastoral wisdom" },
            action: { type: Type.STRING, description: "Single immediate step" },
            prayer: { type: Type.STRING, description: "Short blessing or prayer" },
            schemaVersion: { type: Type.STRING },
            wordCount: { type: Type.NUMBER }
          },
          required: ["title", "empathy", "scripture", "wisdom", "action", "prayer"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DevotionalResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateDevotionalAudio = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak with a warm, conversational, and empathetic tone. Like a kind friend offering advice. "${text}"` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data generated");
    
    return audioData;
  } catch (error) {
    console.error("Gemini Audio Error:", error);
    throw error;
  }
};