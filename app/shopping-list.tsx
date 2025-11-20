import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { formatIngredientAmount } from '../utils/formatting';

export default function ShoppingList() {
    const router = useRouter();
    const { shoppingList, toggleShoppingItem, measurementSystem, clearShoppingList, removeShoppingItem } = useApp();
    const [groupBy, setGroupBy] = useState<'category' | 'recipe'>('category');

    const groupedItems = shoppingList.reduce((acc, item) => {
        const key = groupBy === 'category' ? item.category : item.recipeName;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {} as Record<string, typeof shoppingList>);

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center space-x-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft color="#0f172a" size={24} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-slate-900">Shopping List</Text>
                </View>
                <TouchableOpacity onPress={clearShoppingList}>
                    <Trash2 color="#ef4444" size={24} />
                </TouchableOpacity>
            </View>

            {/* Toggle Grouping */}
            <View className="px-6 mb-6">
                <View className="flex-row bg-slate-200 p-1 rounded-xl">
                    <TouchableOpacity
                        className={`flex-1 py-2 rounded-lg items-center ${groupBy === 'category' ? 'bg-white shadow-sm' : ''}`}
                        onPress={() => setGroupBy('category')}
                    >
                        <Text className={`font-bold ${groupBy === 'category' ? 'text-slate-900' : 'text-slate-500'}`}>By Category</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-2 rounded-lg items-center ${groupBy === 'recipe' ? 'bg-white shadow-sm' : ''}`}
                        onPress={() => setGroupBy('recipe')}
                    >
                        <Text className={`font-bold ${groupBy === 'recipe' ? 'text-slate-900' : 'text-slate-500'}`}>By Recipe</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
                {Object.keys(groupedItems).length === 0 ? (
                    <View className="py-20 items-center">
                        <Text className="text-slate-400 text-lg">Your list is empty.</Text>
                    </View>
                ) : (
                    Object.entries(groupedItems).map(([group, items]) => (
                        <View key={group} className="mb-6">
                            <Text className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-wider">{group}</Text>
                            <View className="bg-white rounded-2xl overflow-hidden">
                                {items.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        className={`flex-row items-center p-4 border-b border-slate-100 ${item.isBought ? 'bg-slate-50' : 'bg-white'}`}
                                        onPress={() => toggleShoppingItem(item.name + item.recipeId)}
                                        onLongPress={() => removeShoppingItem(item.name + item.recipeId)}
                                    >
                                        <View className={`w-6 h-6 rounded-full border mr-3 items-center justify-center ${item.isBought ? 'bg-slate-300 border-slate-300' : 'border-orange-500'}`}>
                                            {item.isBought && <View className="w-3 h-3 bg-white rounded-full" />}
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-base ${item.isBought ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                {item.name}
                                            </Text>
                                            <Text className="text-slate-500 text-sm">
                                                {formatIngredientAmount(item, measurementSystem)}
                                                {groupBy === 'category' && ` • ${item.recipeName}`}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))
                )}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
