


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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Generate a social media post for a content creator about the following topic: "${prompt}". The post should be engaging, friendly, and encourage interaction. Include relevant emojis and hashtags.`,
      config: {
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

        const conversationHistory = messages.slice(-5).map(msg => {
            return `${msg.fromId === currentUserId ? 'Me' : 'Them'}: ${msg.text}`;
        }).join('\n');

        const prompt = `Based on the following conversation, suggest three short, casual, and helpful replies for "Me".
        
        Conversation:
        ${conversationHistory}

        Provide only a JSON array of three strings. Example: ["Sounds good!", "I'll check it out, thanks!", "Let me know if you need anything else."]`;

        const response = await ai.models.generateContent({
            // FIX: Corrected the model name according to the guidelines for basic text tasks.
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
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