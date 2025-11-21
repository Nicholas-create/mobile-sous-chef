import { useRouter } from 'expo-router';
import { ChefHat, ChevronRight, Clock, Flame, Sparkles, Users } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const router = useRouter();

    const vibeStyles: Record<string, { badge: string; badgeText: string; stat: string; accent: string; color: string }> = {
        fast: {
            badge: 'bg-blue-50 border-blue-100',
            badgeText: 'text-blue-800',
            stat: 'bg-blue-50 border border-blue-100',
            accent: 'bg-blue-50 border border-blue-100',
            color: '#2563eb',
        },
        efficient: {
            badge: 'bg-emerald-50 border-emerald-100',
            badgeText: 'text-emerald-800',
            stat: 'bg-emerald-50 border border-emerald-100',
            accent: 'bg-emerald-50 border border-emerald-100',
            color: '#059669',
        },
        craving: {
            badge: 'bg-orange-50 border-orange-100',
            badgeText: 'text-orange-800',
            stat: 'bg-orange-50 border border-orange-100',
            accent: 'bg-orange-50 border border-orange-100',
            color: '#ea580c',
        },
        default: {
            badge: 'bg-slate-100 border-slate-200',
            badgeText: 'text-slate-700',
            stat: 'bg-slate-100 border border-slate-200',
            accent: 'bg-slate-100 border border-slate-200',
            color: '#0f172a',
        },
    };

    const vibeKey = recipe.suggestionType?.toLowerCase() ?? 'default';
    const vibe = vibeStyles[vibeKey] ?? vibeStyles.default;

    const metaChips = [
        {
            key: 'time',
            icon: Clock,
            label: `${recipe.prepTime} + ${recipe.cookTime}`,
            color: vibe.color,
            className: vibe.stat,
        },
        {
            key: 'servings',
            icon: Users,
            label: `${recipe.servings} serv`,
            color: '#0f172a',
            className: 'bg-white border border-slate-200',
        },
    ];

    if (recipe.calories) {
        metaChips.push({
            key: 'calories',
            icon: Flame,
            label: `${recipe.calories} cal`,
            color: '#ea580c',
            className: 'bg-orange-50 border border-orange-100',
        });
    }

    return (
        <TouchableOpacity
            className="mb-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200"
            activeOpacity={0.93}
            onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, recipeData: JSON.stringify(recipe) } })}
        >
            <View className="relative h-48 bg-slate-100">
                {recipe.imageUrl ? (
                    <Image
                        source={{ uri: recipe.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <ChefHat color="#cbd5e1" size={32} />
                        <Text className="text-slate-500 mt-2 text-xs font-semibold">No photo yet</Text>
                    </View>
                )}
                <View className="absolute inset-0 bg-slate-900/5" />

                {recipe.suggestionType && (
                    <View className="absolute top-3 left-3">
                        <View className={`flex-row items-center px-3 py-1.5 rounded-full border ${vibe.badge}`}>
                            <Sparkles size={14} color={vibe.color} />
                            <Text className={`ml-1 text-xs font-semibold tracking-wide uppercase ${vibe.badgeText}`}>
                                {recipe.suggestionType}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <View className="p-5">
                <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                        <Text className="text-xl font-black text-slate-900 leading-7" numberOfLines={2}>{recipe.title}</Text>
                        <Text className="text-slate-600 text-sm leading-6 mt-2" numberOfLines={3}>{recipe.description}</Text>
                    </View>
                    <View className={`ml-2 w-10 h-10 rounded-2xl items-center justify-center ${vibe.accent}`}>
                        <ChevronRight size={18} color={vibe.color} />
                    </View>
                </View>

                <View className="mt-4 flex-row flex-wrap -mr-2">
                    {metaChips.map(({ key, icon: Icon, label, color, className }) => (
                        <View key={key} className={`mr-2 mb-2 flex-row items-center px-3 py-2 rounded-xl ${className}`}>
                            <Icon size={14} color={color} />
                            <Text className="ml-2 text-xs font-semibold text-slate-700">{label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
}
