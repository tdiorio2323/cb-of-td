import { GoogleGenAI, Type } from "@google/genai";
import { Creator, Message, User } from '../types';

// This function is for demonstration purposes to generate mock data.
// In a real application, this would be replaced by a backend service.
// NOTE: This function is not called by default to avoid API key issues for users.
// It is here to show how Gemini could be used to generate initial data.

export const generateMockCreators = async (): Promise<Partial<Creator>[]> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Skipping Gemini data generation.");
    return [];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: "Generate a list of 5 diverse creator profiles for a social platform. Include name, a unique handle, and a short bio.",
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The creator's full name.",
                },
                handle: {
                  type: Type.STRING,
                  description: "The creator's unique username/handle, starting with '@'.",
                },
                bio: {
                  type: Type.STRING,
                  description: "A short, engaging biography for the creator.",
                },
              },
              required: ["name", "handle", "bio"],
            },
          },
       },
    });

    const jsonStr = response.text.trim();
    const creators = JSON.parse(jsonStr);
    return creators;

  } catch (error) {
    console.error("Error generating mock creator data with Gemini:", error);
    return [];
  }
};

export const generatePostDraft = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Skipping Gemini call.");
    return "API key not configured. Please add it to your environment variables.";
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `You are a social media assistant for a top-tier content creator on 'CreatorHub'. 
Your task is to write an engaging, friendly, and exciting post for their fans.

RULES:
- The post must be engaging and encourage interaction (e.g., ask a question).
- Include 2-4 relevant emojis.
- Include 2-3 relevant hashtags at the end (e.g., #CreatorHub, #Exclusive).
- Do NOT include a greeting (e.g., "Hey fans!"). Just start the post.
- Do NOT just repeat the topic. Expand on it.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `My post topic is: "${prompt}"`,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating post draft with Gemini:", error);
    return "Sorry, I couldn't generate a draft right now. Please try again.";
  }
};

export const generateSuggestedReplies = async (messages: Message[], currentUserId: string): Promise<string[]> => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found. Skipping Gemini call.");
        return [];
    }
    const lastMessage = messages[messages.length - 1];
    if (messages.length === 0 || lastMessage.fromId === currentUserId) {
        return [];
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const systemInstruction = `You are a helpful messaging assistant. Your task is to generate three very short, casual, and relevant replies for the user ('Me').
        
RULES:
- The replies should be 1-5 words long (e.g., "Thanks!", "Sounds good", "lol ok").
- The tone should be casual and conversational.`;

        const conversationHistory = messages.slice(-6).map(msg => {
            return `${msg.fromId === currentUserId ? 'Me' : 'Them'}: ${msg.text}`;
        }).join('\n');
        
        const userPrompt = `Here is the recent conversation history:
---
${conversationHistory}
---
The last message was from "Them". Generate 3 replies for "Me".`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "An array of three short, casual reply suggestions, each 1-5 words long.",
                    items: { type: Type.STRING },
                }
            }
        });

        const jsonStr = response.text.trim();
        const replies = JSON.parse(jsonStr);
        return Array.isArray(replies) ? replies.slice(0, 3) : [];
    } catch (error) {
        console.error("Error generating suggested replies with Gemini:", error);
        return [];
    }
};

/**
 * Helper function to convert a Blob to a base64 string.
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result?.toString().split(',')[1];
      if (base64Data) {
        resolve(base64Data);
      } else {
        reject(new Error('Failed to convert blob to base64.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};

/**
 * Transcribes an audio blob to text using 'gemini-2.5-flash'.
 * @param audioBlob The audio file (e.g., from a recording) as a Blob.
 * @returns The transcribed text as a string.
 */
export const transcribeAudioToText = async (
  audioBlob: Blob
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Skipping Gemini call.");
    return "API key not configured. Cannot transcribe.";
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const audioBase64 = await blobToBase64(audioBlob);

    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: audioBlob.type || 'audio/webm',
      },
    };

    const promptPart = {
      text: 'Please transcribe this audio recording into text.',
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, promptPart] },
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return 'Sorry, could not transcribe audio. Please try again.';
  }
};
