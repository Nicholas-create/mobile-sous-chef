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
    recipeId: string;
    recipeName: string;
    isBought: boolean;
}
