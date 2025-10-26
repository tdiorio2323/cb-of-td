
import { GoogleGenAI, Type } from "@google/genai";
import { Creator } from '../types';

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
       contents: "Generate a list of 5 diverse creator profiles for a subscription platform. Include name, a unique handle, a short bio, and a monthly subscription price between 5 and 50.",
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
                subscriptionPrice: {
                  type: Type.NUMBER,
                  description: "The monthly subscription price in USD.",
                }
              },
              required: ["name", "handle", "bio", "subscriptionPrice"],
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
