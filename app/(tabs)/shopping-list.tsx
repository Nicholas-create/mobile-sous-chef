import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { formatIngredientAmount } from '../../utils/formatting';

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
        <View className="flex-1 bg-slate-50 pt-6">

            {/* Toggle Grouping */}
            <View className="px-6 mb-6">
                <View className="flex-row bg-slate-200 p-1 rounded-xl">
                    <Pressable
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                            backgroundColor: groupBy === 'category' ? 'white' : 'transparent',
                            shadowColor: groupBy === 'category' ? '#000' : 'transparent',
                            shadowOpacity: groupBy === 'category' ? 0.1 : 0,
                            shadowRadius: 2,
                            elevation: groupBy === 'category' ? 1 : 0
                        }}
                        onPress={() => setGroupBy('category')}
                    >
                        <Text style={{ fontWeight: 'bold', color: groupBy === 'category' ? '#0f172a' : '#64748b' }}>By Category</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                            backgroundColor: groupBy === 'recipe' ? 'white' : 'transparent',
                            shadowColor: groupBy === 'recipe' ? '#000' : 'transparent',
                            shadowOpacity: groupBy === 'recipe' ? 0.1 : 0,
                            shadowRadius: 2,
                            elevation: groupBy === 'recipe' ? 1 : 0
                        }}
                        onPress={() => setGroupBy('recipe')}
                    >
                        <Text style={{ fontWeight: 'bold', color: groupBy === 'recipe' ? '#0f172a' : '#64748b' }}>By Recipe</Text>
                    </Pressable>
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
                                {items.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        className={`flex-row items-center p-4 border-b border-slate-100 ${item.isBought ? 'bg-slate-50' : 'bg-white'}`}
                                        onPress={() => toggleShoppingItem(item.id)}
                                        onLongPress={() => removeShoppingItem(item.id)}
                                        accessible={true}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{ checked: item.isBought }}
                                        accessibilityLabel={`${item.name}, ${formatIngredientAmount(item, measurementSystem)}${groupBy === 'category' ? `, from ${item.recipeName}` : ''}`}
                                        accessibilityHint={item.isBought ? "Double tap to mark as not purchased. Long press to remove from list." : "Double tap to mark as purchased. Long press to remove from list."}
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
        </View>
    );
}
