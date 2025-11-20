import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from '../constants/aiConfig';
import { Recipe } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const getModel = (modelName: string) => {
    return genAI.getGenerativeModel({ model: modelName });
};

const RECIPE_SCHEMA = `
  Array of objects with:
  id: string (unique UUID),
  title: string,
  description: string,
  prepTime: string,
  cookTime: string,
  servings: number,
  calories: number (optional),
  ingredients: Array of { name: string, amount: string, amountMetric: string, amountImperial: string, category: string, isPantryItem: boolean },
  steps: Array of strings,
  tags: Array of strings,
  suggestionType: 'Efficient' | 'Fast' | 'Craving' (optional),
  suggestionReason: string (optional)
`;

export const GeminiService = {
    async generateRecipesFromText(prompt: string, system: 'metric' | 'imperial'): Promise<Recipe[]> {
        const model = getModel(AI_CONFIG.textToRecipe);
        const generationConfig = {
            responseMimeType: "application/json",
        };

        const fullPrompt = `
      Suggest 3 distinct recipes based on: "${prompt}". 
      Use ${system} units for 'amount'. 
      CRITICAL: Fill 'amountMetric' AND 'amountImperial' fields for every ingredient. 
      Ensure ingredients are categorized. 
      Mark staples (salt, oil) as isPantryItem: true.
      
      Return a JSON array matching this schema: ${RECIPE_SCHEMA}
    `;

        try {
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig
            });
            const response = result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Gemini Text Error:", error);
            return [];
        }
    },

    async generateRecipesFromImage(base64Image: string, system: 'metric' | 'imperial'): Promise<Recipe[]> {
        const model = getModel(AI_CONFIG.imageToRecipe);
        const generationConfig = {
            responseMimeType: "application/json",
        };

        const fullPrompt = `
      Identify ingredients in this image. Suggest 3 recipes made primarily with them. 
      Assume pantry staples are available. Use ${system} units. 
      CRITICAL: Fill 'amountMetric' AND 'amountImperial'.
      
      Return a JSON array matching this schema: ${RECIPE_SCHEMA}
    `;

        try {
            const result = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: fullPrompt },
                            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
                        ]
                    }
                ],
                generationConfig
            });
            const response = result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Gemini Image Error:", error);
            return [];
        }
    },

    async generateDailyMenu(system: 'metric' | 'imperial'): Promise<Recipe[]> {
        const model = getModel(AI_CONFIG.dailyMenu);
        const generationConfig = {
            responseMimeType: "application/json",
        };

        const fullPrompt = `
      Generate a 'Daily Menu' of 3 distinct recipes:
      1. 'Efficient' (Minimal ingredients)
      2. 'Fast' (Under 20 mins)
      3. 'Craving' (Contextual comfort food)
      Use ${system} units. Populate 'suggestionType' and 'suggestionReason'.
      
      Return a JSON array matching this schema: ${RECIPE_SCHEMA}
    `;

        try {
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig
            });
            const response = result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Gemini Menu Error:", error);
            return [];
        }
    },

    async chatWithAssistant(history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> {
        const model = getModel(AI_CONFIG.chatAssistant);
        // Simple chat implementation for CookMode
        const chat = model.startChat({
            history: history as any,
        });
        const result = await chat.sendMessage(message);
        return result.response.text();
    }
};
