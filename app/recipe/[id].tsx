import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Flame, Heart, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CookMode from '../../components/CookMode';
import PantryAudit from '../../components/PantryAudit';
import { useApp } from '../../context/AppContext';
import { Recipe } from '../../types';
import { formatIngredientAmount } from '../../utils/formatting';

export default function RecipeDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { toggleSaveRecipe, savedRecipes, measurementSystem } = useApp();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showPantryAudit, setShowPantryAudit] = useState(false);
    const [showCookMode, setShowCookMode] = useState(false);

    useEffect(() => {
        if (params.recipeData) {
            const parsed = JSON.parse(params.recipeData as string);
            setRecipe(parsed);
            setIsSaved(savedRecipes.some(r => r.id === parsed.id));
        }
    }, [params.recipeData, savedRecipes]);

    if (!recipe) return null;

    const handleSave = () => {
        toggleSaveRecipe(recipe);
        setIsSaved(!isSaved);
    };

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView className="flex-1">
                {/* Image Header */}
                <View className="relative">
                    <Image
                        source={{ uri: recipe.imageUrl || 'https://via.placeholder.com/400' }}
                        className="w-full h-72"
                        resizeMode="cover"
                    />
                    <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-white/80 p-2 rounded-full backdrop-blur-md"
                        >
                            <ArrowLeft color="#0f172a" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-white/80 p-2 rounded-full backdrop-blur-md"
                        >
                            <Heart
                                color={isSaved ? "#ef4444" : "#0f172a"}
                                fill={isSaved ? "#ef4444" : "transparent"}
                                size={24}
                            />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Content */}
                <View className="px-6 py-6 -mt-6 bg-slate-50 rounded-t-3xl">
                    <Text className="text-3xl font-bold text-slate-900 mb-2">{recipe.title}</Text>
                    <Text className="text-slate-500 mb-6 leading-6">{recipe.description}</Text>

                    {/* Stats */}
                    <View className="flex-row justify-between bg-white p-4 rounded-2xl mb-8 shadow-sm">
                        <View className="items-center flex-1 border-r border-slate-100">
                            <Clock color="#ea580c" size={20} className="mb-1" />
                            <Text className="text-slate-900 font-bold">{recipe.prepTime}</Text>
                            <Text className="text-slate-400 text-xs">Prep</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-slate-100">
                            <Flame color="#ea580c" size={20} className="mb-1" />
                            <Text className="text-slate-900 font-bold">{recipe.calories || '-'}</Text>
                            <Text className="text-slate-400 text-xs">Cal</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Users color="#ea580c" size={20} className="mb-1" />
                            <Text className="text-slate-900 font-bold">{recipe.servings}</Text>
                            <Text className="text-slate-400 text-xs">Servings</Text>
                        </View>
                    </View>

                    {/* Ingredients */}
                    <Text className="text-xl font-bold text-slate-900 mb-4">Ingredients</Text>
                    <View className="bg-white p-4 rounded-2xl mb-8 shadow-sm">
                        {recipe.ingredients.map((ing, i) => (
                            <View key={i} className="flex-row py-2 border-b border-slate-100 last:border-0">
                                <Text className="font-bold text-slate-900 w-20">
                                    {formatIngredientAmount(ing, measurementSystem)}
                                </Text>
                                <Text className="text-slate-600 flex-1">{ing.name}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Instructions Preview */}
                    <Text className="text-xl font-bold text-slate-900 mb-4">Instructions</Text>
                    <View className="bg-white p-4 rounded-2xl mb-24 shadow-sm">
                        {recipe.steps.slice(0, 3).map((step, i) => (
                            <View key={i} className="flex-row mb-4">
                                <Text className="text-orange-600 font-bold mr-3">{i + 1}</Text>
                                <Text className="text-slate-600 flex-1 leading-relaxed">{step}</Text>
                            </View>
                        ))}
                        {recipe.steps.length > 3 && (
                            <Text className="text-slate-400 text-center mt-2">...and {recipe.steps.length - 3} more steps</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-slate-100 flex-row space-x-4 pb-8">
                <TouchableOpacity
                    className="flex-1 bg-slate-100 py-4 rounded-2xl items-center"
                    onPress={() => setShowPantryAudit(true)}
                >
                    <Text className="text-slate-900 font-bold text-lg">Plan & Shop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 bg-orange-600 py-4 rounded-2xl items-center shadow-lg shadow-orange-200"
                    onPress={() => setShowCookMode(true)}
                >
                    <Text className="text-white font-bold text-lg">Just Cook</Text>
                </TouchableOpacity>
            </View>

            {/* Modals */}
            <PantryAudit
                visible={showPantryAudit}
                onClose={() => setShowPantryAudit(false)}
                recipe={recipe}
            />
            <CookMode
                visible={showCookMode}
                onClose={() => setShowCookMode(false)}
                recipe={recipe}
            />
        </View>
    );
}
