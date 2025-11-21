import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
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
    const lastRequestTime = useRef<number>(0);

    const handleGenerate = async () => {
        // Input validation
        const sanitizedPrompt = prompt.trim();

        if (!sanitizedPrompt) {
            Alert.alert('Empty Input', 'Please describe what you want to cook');
            return;
        }

        if (sanitizedPrompt.length < 3) {
            Alert.alert('Too Short', 'Please provide more details (at least 3 characters)');
            return;
        }

        if (sanitizedPrompt.length > 500) {
            Alert.alert('Too Long', 'Please keep your request under 500 characters');
            return;
        }

        // Rate limiting check
        const now = Date.now();
        if (lastRequestTime.current && now - lastRequestTime.current < 2000) {
            Alert.alert('Slow Down', 'Please wait a moment before trying again');
            return;
        }
        lastRequestTime.current = now;

        setLoading(true);
        try {
            const results = await GeminiService.generateRecipesFromText(sanitizedPrompt, measurementSystem);
            if (results.length === 0) {
                Alert.alert('No Results', 'No recipes found. Try different ingredients or keywords.');
            } else {
                setRecipes(results);
            }
        } catch (error) {
            console.error('Recipe generation error:', error);
            Alert.alert('Error', 'Failed to generate recipes. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50">

            <ScrollView className="flex-1 px-6 pt-6">
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
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
