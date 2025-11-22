import { formatIngredientAmount } from '../../utils/formatting';
import { Ingredient } from '../../types';

describe('formatIngredientAmount', () => {
  const mockIngredient: Ingredient = {
    name: 'Flour',
    amount: '2 cups',
    amountMetric: '250g',
    amountImperial: '2 cups',
    category: 'Baking',
    isPantryItem: false,
  };

  it('should return metric amount when system is metric', () => {
    const result = formatIngredientAmount(mockIngredient, 'metric');
    expect(result).toBe('250g');
  });

  it('should return imperial amount when system is imperial', () => {
    const result = formatIngredientAmount(mockIngredient, 'imperial');
    expect(result).toBe('2 cups');
  });

  it('should return default amount if metric not available', () => {
    const ingredientWithoutMetric: Ingredient = {
      ...mockIngredient,
      amountMetric: undefined,
    };
    const result = formatIngredientAmount(ingredientWithoutMetric, 'metric');
    expect(result).toBe('2 cups');
  });

  it('should return default amount if imperial not available', () => {
    const ingredientWithoutImperial: Ingredient = {
      ...mockIngredient,
      amountImperial: undefined,
    };
    const result = formatIngredientAmount(ingredientWithoutImperial, 'imperial');
    expect(result).toBe('2 cups');
  });
});
