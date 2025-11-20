import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { useApp } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { Recipe } from '../types';

export default function Planner() {
    const router = useRouter();
    const { measurementSystem } = useApp();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const results = await GeminiService.generateRecipesFromText(prompt, measurementSystem);
            setRecipes(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 py-4 flex-row items-center space-x-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color="#0f172a" size={24} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-slate-900">Planner</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                <Text className="text-slate-600 mb-2">What are you craving?</Text>
                <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-6">
                    <TextInput
                        className="text-lg text-slate-900 min-h-[100px]"
                        placeholder="e.g., spicy pasta with shrimp..."
                        multiline
                        textAlignVertical="top"
                        value={prompt}
                        onChangeText={setPrompt}
                    />
                </View>

                <TouchableOpacity
                    className={`w-full py-4 rounded-2xl flex-row justify-center items-center mb-8 ${loading ? 'bg-orange-400' : 'bg-orange-600'}`}
                    onPress={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Sparkles color="white" size={20} className="mr-2" />
                            <Text className="text-white font-bold text-lg ml-2">Generate Recipes</Text>
                        </>
                    )}
                </TouchableOpacity>

                {recipes.length > 0 && (
                    <View className="pb-10">
                        <Text className="text-xl font-bold text-slate-900 mb-4">Suggestions</Text>
                        {recipes.map((recipe, index) => (
                            <RecipeCard key={index} recipe={recipe} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
