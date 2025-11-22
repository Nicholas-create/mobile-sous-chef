import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';

const RECIPE_STORAGE_KEY = 'mobile_sous_chef_recipes';

export const StorageService = {
    async saveRecipes(recipes: Recipe[]): Promise<void> {
        try {
            const existing = await this.getRecipes();
            // Merge new recipes with existing ones, avoiding duplicates by ID
            const combined = [...recipes, ...existing];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

            // Limit storage to last 50 recipes to save space
            const limited = unique.slice(0, 50);

            await AsyncStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(limited));
        } catch (error) {
            console.error('Failed to save recipes:', error);
        }
    },

    async getRecipes(): Promise<Recipe[]> {
        try {
            const json = await AsyncStorage.getItem(RECIPE_STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (error) {
            console.error('Failed to load recipes:', error);
            return [];
        }
    },

    async clearRecipes(): Promise<void> {
        try {
            await AsyncStorage.removeItem(RECIPE_STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear recipes:', error);
        }
    }
};
