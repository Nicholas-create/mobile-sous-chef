import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Recipe, ShoppingItem } from '../types';

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

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        saveData();
    }, [savedRecipes, shoppingList, measurementSystem]);

    const loadData = async () => {
        try {
            const recipes = await AsyncStorage.getItem('savedRecipes');
            const list = await AsyncStorage.getItem('shoppingList');
            const system = await AsyncStorage.getItem('measurementSystem');

            if (recipes) setSavedRecipes(JSON.parse(recipes));
            if (list) setShoppingList(JSON.parse(list));
            if (system) setMeasurementSystem(system as 'metric' | 'imperial');
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
            await AsyncStorage.setItem('measurementSystem', measurementSystem);
        } catch (e) {
            console.error('Failed to save data', e);
        }
    };

    const toggleSaveRecipe = (recipe: Recipe) => {
        setSavedRecipes(prev => {
            const exists = prev.find(r => r.id === recipe.id);
            if (exists) {
                return prev.filter(r => r.id !== recipe.id);
            }
            return [...prev, recipe];
        });
    };

    const addToShoppingList = (items: ShoppingItem[]) => {
        setShoppingList(prev => [...prev, ...items]);
    };

    const toggleShoppingItem = (itemId: string) => {
        setShoppingList(prev => prev.map(item =>
            // Using name + recipeId as a pseudo-unique key if id is missing or generic
            (item.name + item.recipeId === itemId || (item as any).id === itemId)
                ? { ...item, isBought: !item.isBought }
                : item
        ));
    };

    const removeShoppingItem = (itemId: string) => {
        setShoppingList(prev => prev.filter(item => (item.name + item.recipeId !== itemId && (item as any).id !== itemId)));
    }

    const clearShoppingList = () => {
        setShoppingList([]);
    }

    return (
        <AppContext.Provider value={{
            savedRecipes,
            shoppingList,
            measurementSystem,
            toggleSaveRecipe,
            addToShoppingList,
            toggleShoppingItem,
            setMeasurementSystem,
            clearShoppingList,
            removeShoppingItem
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
