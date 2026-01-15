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
  const prompt = `
    You are a wise, loving, and deeply empathetic spiritual friend sitting across the table from someone who needs to talk.
    
    **THE CONTEXT:**
    Your friend just said to you: "${topic}"

    **YOUR GOAL:**
    Respond conversationally. Do not write a "sermon" or a "devotional entry." Write a **personal response** to a friend.
    
    **TONE GUIDELINES:**
    1.  **Be Conversational:** Use "I", "You", and "We". Sound like a human, not a database.
    2.  **Be Empathetic:** Validate their feelings immediately. Make them feel heard.
    3.  **Be Simple:** Avoid religious jargon (no "beseech", "hath", "season"). Use everyday language.
    4.  **Faith + Works:** Always suggest a physical action alongside the spiritual truth.

    **REQUIRED JSON OUTPUT (Must strictly follow this schema):**
    1. title: A short, warm 2-3 word phrase summing up your advice (e.g., "It's Okay to Rest").
    2. empathy: The opening sentence of your conversation. Validate them warmly (e.g., "I can hear how heavy your heart is right now, and I want you to know it's okay to feel that way.").
    3. scripture: A specific Bible verse (Text + Reference) that fits the conversation naturally.
    4. wisdom: The core of your advice. Speak directly to them. Keep it simple and profound (approx 2 sentences).
    5. action: A specific **PHYSICAL** step. Not just "pray". Something they can do with their hands or body (e.g., "Drink a glass of water," "Take a walk," "Write it down").
    6. prayer: A short, 1-sentence prayer they can whisper right now.

    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short warm title" },
            empathy: { type: Type.STRING, description: "Conversational opening" },
            scripture: { type: Type.STRING, description: "Bible verse" },
            wisdom: { type: Type.STRING, description: "Conversational advice" },
            action: { type: Type.STRING, description: "Physical action step" },
            prayer: { type: Type.STRING, description: "Simple prayer" }
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