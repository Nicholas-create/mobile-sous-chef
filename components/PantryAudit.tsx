import { Check, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { Ingredient, Recipe, ShoppingItem } from '../types';
import { formatIngredientAmount } from '../utils/formatting';

interface PantryAuditProps {
    visible: boolean;
    onClose: () => void;
    recipe: Recipe;
}

export default function PantryAudit({ visible, onClose, recipe }: PantryAuditProps) {
    const { addToShoppingList, measurementSystem } = useApp();
    const [items, setItems] = useState<Ingredient[]>([]);

    useEffect(() => {
        if (recipe) {
            // Default: check items that are pantry items (user HAS them)
            // User unchecks if they DON'T have them.
            // Wait, logic says: "Show all ingredients... By default, check off items where isPantryItem === true. User unchecks items they *don't* have."
            // "Generate Shopping List button adds only *unchecked* items".
            // This means checked = "I have it". Unchecked = "I need to buy it".
            // So if isPantryItem is true, it starts checked. If false, it starts unchecked.
            setItems(recipe.ingredients.map(ing => ({
                ...ing,
                checked: ing.isPantryItem
            })));
        }
    }, [recipe, visible]);

    const toggleItem = (index: number) => {
        const newItems = [...items];
        newItems[index].checked = !newItems[index].checked;
        setItems(newItems);
    };

    const handleGenerate = () => {
        // Add UNCHECKED items to shopping list
        const toBuy = items.filter(i => !i.checked).map(i => ({
            ...i,
            recipeId: recipe.id,
            recipeName: recipe.title,
            isBought: false
        } as ShoppingItem));

        addToShoppingList(toBuy);
        onClose();
        // Maybe show a toast or alert?
        alert(`Added ${toBuy.length} items to shopping list.`);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-slate-50 p-6">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-slate-900">Pantry Audit</Text>
                    <TouchableOpacity onPress={onClose}>
                        <X color="#0f172a" size={24} />
                    </TouchableOpacity>
                </View>

                <Text className="text-slate-600 mb-4">
                    Uncheck items you need to buy. Checked items are what you already have.
                </Text>

                <ScrollView className="flex-1 mb-6">
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-center py-3 border-b border-slate-200"
                            onPress={() => toggleItem(index)}
                        >
                            <View className={`w-6 h-6 rounded border mr-3 items-center justify-center ${item.checked ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                {item.checked && <Check size={16} color="white" />}
                            </View>
                            <View className="flex-1">
                                <Text className={`text-lg ${item.checked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                    {item.name}
                                </Text>
                                <Text className="text-slate-500 text-sm">
                                    {formatIngredientAmount(item, measurementSystem)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    className="w-full bg-orange-600 py-4 rounded-2xl items-center"
                    onPress={handleGenerate}
                >
                    <Text className="text-white font-bold text-lg">Generate Shopping List</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
