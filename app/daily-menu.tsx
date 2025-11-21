import { Stack, useRouter } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { useApp } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { Recipe } from '../types';

export default function DailyMenu() {
    const router = useRouter();
    const { measurementSystem } = useApp();
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const results = await GeminiService.generateDailyMenu(measurementSystem);
            setRecipes(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    return (
        <View className="flex-1 bg-slate-50">
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={fetchMenu} disabled={loading}>
                            <RefreshCw color={loading ? "#cbd5e1" : "#ea580c"} size={24} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView className="flex-1 px-6 pt-6">
                <Text className="text-slate-600 mb-6">Here are today's chef suggestions.</Text>

                {loading ? (
                    <View className="py-20 items-center">
                        <ActivityIndicator size="large" color="#ea580c" />
                        <Text className="text-slate-500 mt-4">Curating your menu...</Text>
                    </View>
                ) : (
                    <View className="pb-10">
                        {recipes.map((recipe) => (
                            <View key={recipe.id} className="mb-8">
                                <View className="mb-3">
                                    <Text className="text-orange-600 font-bold text-xs uppercase tracking-widest mb-1">
                                        {recipe.suggestionType}
                                    </Text>
                                    <Text className="text-slate-600 text-sm leading-6">
                                        {recipe.suggestionReason}
                                    </Text>
                                </View>
                                <RecipeCard recipe={recipe} />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
