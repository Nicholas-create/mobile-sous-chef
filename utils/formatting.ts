import { Ingredient } from '../types';

export function formatIngredientAmount(ingredient: Ingredient, system: 'metric' | 'imperial'): string {
    if (system === 'metric' && ingredient.amountMetric) {
        return ingredient.amountMetric;
    }
    if (system === 'imperial' && ingredient.amountImperial) {
        return ingredient.amountImperial;
    }
    return ingredient.amount;
}
