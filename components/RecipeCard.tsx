import { useRouter } from 'expo-router';
import { Clock, Flame, Users } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100"
            onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, recipeData: JSON.stringify(recipe) } })}
        >
            {recipe.imageUrl && (
                <Image
                    source={{ uri: recipe.imageUrl }}
                    className="w-full h-40 rounded-xl mb-3"
                    resizeMode="cover"
                />
            )}
            <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-slate-900 mb-1">{recipe.title}</Text>
                    <Text className="text-slate-500 text-sm line-clamp-2" numberOfLines={2}>{recipe.description}</Text>
                </View>
                {recipe.suggestionType && (
                    <View className="bg-orange-100 px-2 py-1 rounded-lg">
                        <Text className="text-orange-700 text-xs font-bold">{recipe.suggestionType}</Text>
                    </View>
                )}
            </View>

            <View className="flex-row mt-4 space-x-4">
                <View className="flex-row items-center">
                    <Clock size={14} color="#64748b" />
                    <Text className="text-slate-500 text-xs ml-1">{recipe.prepTime} + {recipe.cookTime}</Text>
                </View>
                <View className="flex-row items-center">
                    <Users size={14} color="#64748b" />
                    <Text className="text-slate-500 text-xs ml-1">{recipe.servings} serv</Text>
                </View>
                {recipe.calories && (
                    <View className="flex-row items-center">
                        <Flame size={14} color="#64748b" />
                        <Text className="text-slate-500 text-xs ml-1">{recipe.calories} cal</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
