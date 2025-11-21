import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { Recipe, ShoppingItem, RecipeArraySchema, ShoppingItemSchema } from '../types';
import { z } from 'zod';

interface AppContextType {
    savedRecipes: Recipe[];
    shoppingList: ShoppingItem[];
    measurementSystem: 'metric' | 'imperial';
    toggleSaveRecipe: (recipe: Recipe) => void;
    addToShoppingList: (items: ShoppingItem[]) => void;
    toggleShoppingItem: (itemId: string) => void; // Assuming unique ID or combination
    setMeasurementSystem: (system: 'metric' | 'imperial') => void;
    clearShoppingList: () => void;
    removeShoppingItem: (itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [measurementSystem, setMeasurementSystem] = useState<'metric' | 'imperial'>('metric');

    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const isInitialMount = useRef(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const recipes = await AsyncStorage.getItem('savedRecipes');
            const list = await AsyncStorage.getItem('shoppingList');
            const system = await AsyncStorage.getItem('measurementSystem');

            // Safe JSON parsing with validation
            if (recipes) {
                try {
                    const parsed = JSON.parse(recipes);
                    const validated = RecipeArraySchema.safeParse(parsed);
                    if (validated.success) {
                        setSavedRecipes(validated.data);
                    } else {
                        console.error('Invalid saved recipes data:', validated.error);
                        setSavedRecipes([]);
                    }
                } catch (e) {
                    console.error('Failed to parse saved recipes:', e);
                    setSavedRecipes([]);
                }
            }

            if (list) {
                try {
                    const parsed = JSON.parse(list);

                    // Migrate old data: add IDs if missing
                    const migratedData = parsed.map((item: any) => ({
                        ...item,
                        id: item.id || `${item.recipeId}-${item.name}-${Date.now()}-${Math.random()}`
                    }));

                    const validated = z.array(ShoppingItemSchema).safeParse(migratedData);
                    if (validated.success) {
                        setShoppingList(validated.data);
                    } else {
                        console.error('Invalid shopping list data:', validated.error);
                        // Still try to use the migrated data even if validation fails
                        setShoppingList(migratedData);
                    }
                } catch (e) {
                    console.error('Failed to parse shopping list:', e);
                    setShoppingList([]);
                }
            }

            if (system) {
                if (system === 'metric' || system === 'imperial') {
                    setMeasurementSystem(system);
                }
            }
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    // Memoize saveData to prevent unnecessary recreations
    const saveData = useCallback(async () => {
        try {
            await Promise.all([
                AsyncStorage.setItem('savedRecipes', JSON.stringify(savedRecipes)),
                AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList)),
                AsyncStorage.setItem('measurementSystem', measurementSystem)
            ]);
        } catch (e) {
            console.error('Failed to save data', e);
        }
    }, [savedRecipes, shoppingList, measurementSystem]);

    // Debounced save effect - fixes memory leak
    useEffect(() => {
        // Skip saving on initial mount (wait for loadData to complete)
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Debounce saves by 500ms
        saveTimeoutRef.current = setTimeout(() => {
            saveData();
        }, 500);

        // Cleanup on unmount
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [saveData]);

    const toggleSaveRecipe = useCallback((recipe: Recipe) => {
        setSavedRecipes(prev => {
            const exists = prev.find(r => r.id === recipe.id);
            if (exists) {
                return prev.filter(r => r.id !== recipe.id);
            }
            return [...prev, recipe];
        });
    }, []);

    const addToShoppingList = useCallback((items: ShoppingItem[]) => {
        // Ensure all items have unique IDs
        const itemsWithIds = items.map(item => ({
            ...item,
            id: item.id || `${item.recipeId}-${item.name}-${Date.now()}-${Math.random()}`
        }));
        setShoppingList(prev => [...prev, ...itemsWithIds]);
    }, []);

    const toggleShoppingItem = useCallback((itemId: string) => {
        setShoppingList(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, isBought: !item.isBought }
                : item
        ));
    }, []);

    const removeShoppingItem = useCallback((itemId: string) => {
        setShoppingList(prev => prev.filter(item => item.id !== itemId));
    }, []);

    const clearShoppingList = useCallback(() => {
        setShoppingList([]);
    }, []);

    const value = React.useMemo(() => ({
        savedRecipes,
        shoppingList,
        measurementSystem,
        toggleSaveRecipe,
        addToShoppingList,
        toggleShoppingItem,
        setMeasurementSystem,
        clearShoppingList,
        removeShoppingItem
    }), [savedRecipes, shoppingList, measurementSystem, toggleSaveRecipe, addToShoppingList, toggleShoppingItem, clearShoppingList, removeShoppingItem]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
