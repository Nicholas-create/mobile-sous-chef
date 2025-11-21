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
            const recipes: Recipe[] = JSON.parse(response.text());

            // Generate images for each recipe in parallel
            const recipesWithImages = await Promise.all(recipes.map(async (recipe) => {
                try {
                    const imagePrompt = `A professional food photography shot of ${recipe.title}: ${recipe.description}. High resolution, appetizing, well-lit.`;
                    const base64Image = await GeminiService.generateImage(imagePrompt);
                    return { ...recipe, imageUrl: base64Image ? `data:image/jpeg;base64,${base64Image}` : undefined };
                } catch (imgError) {
                    console.error(`Failed to generate image for ${recipe.title}:`, imgError);
                    return recipe;
                }
            }));

            return recipesWithImages;
        } catch (error) {
            console.error("Gemini Menu Error:", error);
            return [];
        }
    },

    async generateImage(prompt: string): Promise<string | null> {
        // Use direct REST API for Imagen as SDK support for 'predict' might be limited or different
        const modelName = AI_CONFIG.imageGenerator;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${API_KEY}`;

        const payload = {
            instances: [
                {
                    prompt: prompt
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "1:1" // Optional, can be adjusted
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json();

            // Imagen response structure:
            // { predictions: [ { bytesBase64Encoded: "..." } ] }
            if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
                return data.predictions[0].bytesBase64Encoded;
            } else if (data.predictions && data.predictions[0] && data.predictions[0].mimeType && data.predictions[0].bytesBase64Encoded) {
                // Some versions might return it this way
                return data.predictions[0].bytesBase64Encoded;
            }

            console.log("Unexpected Image generation response structure:", JSON.stringify(data, null, 2));
            return null;

        } catch (error) {
            console.error("Gemini Image Generation Error:", error);
            return null;
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
