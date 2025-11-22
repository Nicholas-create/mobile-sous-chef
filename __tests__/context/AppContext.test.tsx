import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AppProvider, useApp } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, ShoppingItem } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  const mockRecipe: Recipe = {
    id: 'test-recipe-1',
    title: 'Test Recipe',
    description: 'A test recipe',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 4,
    calories: 350,
    ingredients: [
      {
        name: 'Flour',
        amount: '2 cups',
        amountMetric: '250g',
        amountImperial: '2 cups',
        category: 'Baking',
        isPantryItem: false,
      },
    ],
    steps: ['Step 1', 'Step 2'],
    tags: ['easy', 'quick'],
  };

  it('should provide initial state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.savedRecipes).toEqual([]);
    expect(result.current.shoppingList).toEqual([]);
    expect(result.current.measurementSystem).toBe('metric');
  });

  it('should toggle save recipe', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.toggleSaveRecipe(mockRecipe);
    });

    expect(result.current.savedRecipes).toHaveLength(1);
    expect(result.current.savedRecipes[0]).toEqual(mockRecipe);

    // Toggle again to remove
    act(() => {
      result.current.toggleSaveRecipe(mockRecipe);
    });

    expect(result.current.savedRecipes).toHaveLength(0);
  });

  it('should add items to shopping list', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const shoppingItem: ShoppingItem = {
      id: 'item-1',
      name: 'Flour',
      amount: '2 cups',
      amountMetric: '250g',
      amountImperial: '2 cups',
      category: 'Baking',
      isPantryItem: false,
      recipeId: 'test-recipe-1',
      recipeName: 'Test Recipe',
      isBought: false,
    };

    act(() => {
      result.current.addToShoppingList([shoppingItem]);
    });

    expect(result.current.shoppingList).toHaveLength(1);
    expect(result.current.shoppingList[0].name).toBe('Flour');
  });

  it('should toggle shopping item bought status', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const shoppingItem: ShoppingItem = {
      id: 'item-1',
      name: 'Flour',
      amount: '2 cups',
      amountMetric: '250g',
      amountImperial: '2 cups',
      category: 'Baking',
      isPantryItem: false,
      recipeId: 'test-recipe-1',
      recipeName: 'Test Recipe',
      isBought: false,
    };

    act(() => {
      result.current.addToShoppingList([shoppingItem]);
    });

    act(() => {
      result.current.toggleShoppingItem('item-1');
    });

    expect(result.current.shoppingList[0].isBought).toBe(true);

    act(() => {
      result.current.toggleShoppingItem('item-1');
    });

    expect(result.current.shoppingList[0].isBought).toBe(false);
  });

  it('should remove shopping item', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const shoppingItem: ShoppingItem = {
      id: 'item-1',
      name: 'Flour',
      amount: '2 cups',
      amountMetric: '250g',
      amountImperial: '2 cups',
      category: 'Baking',
      isPantryItem: false,
      recipeId: 'test-recipe-1',
      recipeName: 'Test Recipe',
      isBought: false,
    };

    act(() => {
      result.current.addToShoppingList([shoppingItem]);
    });

    expect(result.current.shoppingList).toHaveLength(1);

    act(() => {
      result.current.removeShoppingItem('item-1');
    });

    expect(result.current.shoppingList).toHaveLength(0);
  });

  it('should clear shopping list', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const shoppingItems: ShoppingItem[] = [
      {
        id: 'item-1',
        name: 'Flour',
        amount: '2 cups',
        amountMetric: '250g',
        amountImperial: '2 cups',
        category: 'Baking',
        isPantryItem: false,
        recipeId: 'test-recipe-1',
        recipeName: 'Test Recipe',
        isBought: false,
      },
      {
        id: 'item-2',
        name: 'Sugar',
        amount: '1 cup',
        amountMetric: '200g',
        amountImperial: '1 cup',
        category: 'Baking',
        isPantryItem: false,
        recipeId: 'test-recipe-1',
        recipeName: 'Test Recipe',
        isBought: false,
      },
    ];

    act(() => {
      result.current.addToShoppingList(shoppingItems);
    });

    expect(result.current.shoppingList).toHaveLength(2);

    act(() => {
      result.current.clearShoppingList();
    });

    expect(result.current.shoppingList).toHaveLength(0);
  });

  it('should change measurement system', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.measurementSystem).toBe('metric');

    act(() => {
      result.current.setMeasurementSystem('imperial');
    });

    expect(result.current.measurementSystem).toBe('imperial');
  });
});
