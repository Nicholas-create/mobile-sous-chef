import { httpsCallable } from 'firebase/functions';
import { AI_CONFIG } from '../constants/aiConfig';
import { functions } from '../services/firebaseConfig';
import { Recipe, RecipeArraySchema } from '../types';
import { cleanJsonString, withRetry } from '../utils/apiUtils';
import { addBreadcrumb, logError } from './errorTracking';
import { StorageService } from './storageService';

const RECIPE_SCHEMA = `
  Array of objects with:
  id: string (unique UUID),
  title: string,
  description: string,
  prepTime: string,
  cookTime: string,
  servings: number,
  calories: number (REQUIRED),
  ingredients: Array of { name: string, amount: string, amountMetric: string, amountImperial: string, category: string, isPantryItem: boolean },
  steps: Array of strings,
  tags: Array of strings,
  suggestionType: 'Efficient' | 'Fast' | 'Craving' (optional),
  suggestionReason: string (optional)
`;

export const GeminiCloudService = {
    async generateRecipesFromText(prompt: string, system: 'metric' | 'imperial'): Promise<Recipe[]> {
        const generateRecipes = httpsCallable(functions, 'generateRecipes');

        const fullPrompt = `
          Suggest 3 distinct recipes based on: "${prompt}".
          Use ${system} units for 'amount'.
          CRITICAL: Fill 'amountMetric' AND 'amountImperial' fields for every ingredient.
          CRITICAL: The 'calories' field is REQUIRED.
          Ensure ingredients are categorized.
          Mark staples (salt, oil) as isPantryItem: true.
    
          Return a JSON array matching this schema: ${RECIPE_SCHEMA}
        `;

        try {
            const result = await withRetry(() => generateRecipes({
                prompt: fullPrompt,
                modelName: AI_CONFIG.textToRecipe
            }));

            const data = result.data as { text: string };
            const rawData = JSON.parse(cleanJsonString(data.text));
            const validated = RecipeArraySchema.safeParse(rawData);

            if (!validated.success) {
                console.error("Invalid recipe data from Cloud:", validated.error);
                return [];
            }

            addBreadcrumb('Generated recipes from cloud', 'ai', { count: validated.data.length });
            await StorageService.saveRecipes(validated.data);
            return validated.data;

        } catch (error) {
            console.error("Cloud Text Error:", error);
            logError(error instanceof Error ? error : new Error('Cloud Text Error'), { feature: 'cloudTextToRecipe' });
            return [];
        }
    },

    async generateRecipesFromImage(base64Image: string, system: 'metric' | 'imperial'): Promise<Recipe[]> {
        const generateRecipesFromImage = httpsCallable(functions, 'generateRecipesFromImage');

        const fullPrompt = `
          Identify ingredients in this image. Suggest 3 recipes made primarily with them.
          Assume pantry staples are available. Use ${system} units.
          CRITICAL: Fill 'amountMetric' AND 'amountImperial' for every ingredient.
          CRITICAL: The 'calories' field is REQUIRED.
    
          Return a JSON array matching this schema: ${RECIPE_SCHEMA}
        `;

        try {
            const result = await withRetry(() => generateRecipesFromImage({
                prompt: fullPrompt,
                imageBase64: base64Image,
                modelName: AI_CONFIG.imageToRecipe
            }));

            const data = result.data as { text: string };
            const rawData = JSON.parse(cleanJsonString(data.text));
            const validated = RecipeArraySchema.safeParse(rawData);

            if (!validated.success) {
                console.error("Invalid recipe data from Cloud Image:", validated.error);
                return [];
            }

            await StorageService.saveRecipes(validated.data);
            return validated.data;

        } catch (error) {
            console.error("Cloud Image Error:", error);
            return [];
        }
    },

    async generateDailyMenu(system: 'metric' | 'imperial'): Promise<Recipe[]> {
        const generateDailyMenu = httpsCallable(functions, 'generateDailyMenu');

        const fullPrompt = `
          Generate a 'Daily Menu' of 3 distinct recipes:
          1. 'Efficient' (Minimal ingredients)
          2. 'Fast' (Under 20 mins)
          3. 'Craving' (Contextual comfort food)
          Use ${system} units. Populate 'suggestionType' and 'suggestionReason'.
          CRITICAL: Fill 'amountMetric' AND 'amountImperial' for every ingredient.
          CRITICAL: The 'calories' field is REQUIRED.
    
          Return a JSON array matching this schema: ${RECIPE_SCHEMA}
        `;

        try {
            const result = await withRetry(() => generateDailyMenu({
                prompt: fullPrompt,
                modelName: AI_CONFIG.dailyMenu
            }));

            const data = result.data as { text: string };
            const rawData = JSON.parse(cleanJsonString(data.text));
            const validated = RecipeArraySchema.safeParse(rawData);

            if (!validated.success) {
                console.error("Invalid recipe data from Cloud Menu:", validated.error);
                return [];
            }

            const recipes = validated.data;

            // Generate images in parallel
            const recipesWithImages = await Promise.all(recipes.map(async (recipe) => {
                try {
                    const imagePrompt = `A professional food photography shot of ${recipe.title}: ${recipe.description}. High resolution, appetizing, well-lit.`;
                    const base64Image = await GeminiCloudService.generateImage(imagePrompt);
                    return { ...recipe, imageUrl: base64Image ? `data:image/jpeg;base64,${base64Image}` : undefined };
                } catch (imgError) {
                    console.error(`Failed to generate image for ${recipe.title}:`, imgError);
                    return recipe;
                }
            }));

            await StorageService.saveRecipes(recipesWithImages);
            return recipesWithImages;

        } catch (error) {
            console.error("Cloud Menu Error:", error);
            return [];
        }
    },

    async generateImage(prompt: string): Promise<string | null> {
        const generateImage = httpsCallable(functions, 'generateImage');
        try {
            const result = await withRetry(() => generateImage({
                prompt,
                modelName: AI_CONFIG.imageGenerator
            }));

            const data = result.data as { base64: string | null };
            return data.base64;
        } catch (error) {
            console.error("Cloud Image Gen Error:", error);
            return null;
        }
    },

    async chatWithAssistant(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string): Promise<string> {
        const chatWithAssistant = httpsCallable(functions, 'chatWithAssistant');
        try {
            const result = await chatWithAssistant({
                history,
                message,
                modelName: AI_CONFIG.chatAssistant
            });

            const data = result.data as { text: string };
            return data.text;
        } catch (error) {
            console.error("Cloud Chat Error:", error);
            return "I'm having trouble connecting to the cloud right now. Please try again.";
        }
    }
};
