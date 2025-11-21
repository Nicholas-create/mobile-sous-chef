import { z } from 'zod';

export enum AppMode {
    DASHBOARD = 'DASHBOARD',
    PLANNER = 'PLANNER',
    SCAVENGER = 'SCAVENGER',
    INDECISIVE = 'INDECISIVE',
    RECIPE_DETAILS = 'RECIPE_DETAILS',
    PANTRY_AUDIT = 'PANTRY_AUDIT',
    COOK_MODE = 'COOK_MODE',
    SHOPPING_LIST = 'SHOPPING_LIST',
    SAVED_RECIPES = 'SAVED_RECIPES',
    SETTINGS = 'SETTINGS',
}

export interface Ingredient {
    name: string;
    amount: string;
    amountMetric?: string;
    amountImperial?: string;
    category: string; // e.g., Produce, Dairy, Pantry
    isPantryItem: boolean;
    checked?: boolean; // For Pantry Audit state
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    prepTime: string;
    cookTime: string;
    servings: number;
    calories?: number;
    ingredients: Ingredient[];
    steps: string[];
    tags: string[];
    imageUrl?: string;
    suggestionType?: 'Efficient' | 'Fast' | 'Craving';
    suggestionReason?: string;
}

export interface ShoppingItem extends Ingredient {
    id: string; // Added for proper identification
    recipeId: string;
    recipeName: string;
    isBought: boolean;
}

// Zod Schemas for Runtime Validation
export const IngredientSchema = z.object({
    name: z.string(),
    amount: z.string(),
    amountMetric: z.string().optional(),
    amountImperial: z.string().optional(),
    category: z.string(),
    isPantryItem: z.boolean(),
    checked: z.boolean().optional(),
});

export const RecipeSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
    calories: z.number().optional(),
    ingredients: z.array(IngredientSchema),
    steps: z.array(z.string()),
    tags: z.array(z.string()),
    imageUrl: z.string().optional(),
    suggestionType: z.enum(['Efficient', 'Fast', 'Craving']).optional(),
    suggestionReason: z.string().optional(),
});

export const RecipeArraySchema = z.array(RecipeSchema);

export const ShoppingItemSchema = IngredientSchema.extend({
    id: z.string(),
    recipeId: z.string(),
    recipeName: z.string(),
    isBought: z.boolean(),
});
