import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ChefHat, Filter, Sparkles } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../components/RecipeCard';
import { useApp } from '../../context/AppContext';

export default function Cookbook() {
    const router = useRouter();
    const { savedRecipes } = useApp();

    const [activeFilter, setActiveFilter] = useState<'all' | 'fast' | 'efficient' | 'craving'>('all');

    const vibeCounts = useMemo(() => ({
        all: savedRecipes.length,
        fast: savedRecipes.filter(recipe => recipe.suggestionType === 'Fast').length,
        efficient: savedRecipes.filter(recipe => recipe.suggestionType === 'Efficient').length,
        craving: savedRecipes.filter(recipe => recipe.suggestionType === 'Craving').length,
    }), [savedRecipes]);

    const filteredRecipes = useMemo(() => {
        if (activeFilter === 'all') return savedRecipes;
        return savedRecipes.filter(recipe => recipe.suggestionType?.toLowerCase() === activeFilter);
    }, [activeFilter, savedRecipes]);

    const filters: Array<{ key: 'all' | 'fast' | 'efficient' | 'craving'; label: string; accent: string }> = [
        { key: 'all', label: 'Everything', accent: 'bg-slate-900' },
        { key: 'fast', label: 'Fast', accent: 'bg-blue-600' },
        { key: 'efficient', label: 'Efficient', accent: 'bg-emerald-600' },
        { key: 'craving', label: 'Craving', accent: 'bg-orange-600' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {savedRecipes.length === 0 ? (
                    <View className="px-6 pt-8">
                        <View className="bg-white border border-dashed border-slate-200 rounded-3xl p-6 items-center">
                            <View className="w-14 h-14 rounded-2xl bg-orange-50 items-center justify-center mb-3">
                                <ChefHat color="#f97316" size={24} />
                            </View>
                            <Text className="text-xl font-bold text-slate-900">Your book is empty</Text>
                            <Text className="text-slate-500 text-center mt-2 leading-relaxed">
                                Generate a plan or browse the daily menu to save your first recipe.
                            </Text>
                            <View className="flex-row mt-5 space-x-3">
                                <TouchableOpacity
                                    className="flex-1 bg-orange-600 py-3 rounded-2xl items-center shadow-sm shadow-orange-200"
                                    onPress={() => router.push('/planner')}
                                >
                                    <Text className="text-white font-bold">Open Planner</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 bg-slate-100 py-3 rounded-2xl items-center"
                                    onPress={() => router.push('/daily-menu')}
                                >
                                    <Text className="text-slate-900 font-bold">Daily Picks</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        <View className="px-6 pt-6">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <Filter color="#0f172a" size={18} />
                                    <Text className="text-lg font-bold text-slate-900 ml-2">Filter by vibe</Text>
                                </View>
                                {activeFilter !== 'all' && (
                                    <TouchableOpacity onPress={() => setActiveFilter('all')}>
                                        <Text className="text-orange-700 font-semibold text-sm">Reset</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View className="flex-row flex-wrap -mr-2">
                                {filters.map(filter => {
                                    const isActive = activeFilter === filter.key;
                                    return (
                                        <TouchableOpacity
                                            key={filter.key}
                                            className={`mr-2 mb-2 px-4 py-2 rounded-full border flex-row items-center ${isActive ? `${filter.accent} border-transparent` : 'bg-white border-slate-200'}`}
                                            onPress={() => setActiveFilter(filter.key)}
                                            activeOpacity={0.9}
                                        >
                                            <Sparkles size={14} color={isActive ? '#f8fafc' : '#0f172a'} />
                                            <Text className={`ml-1 text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                                {filter.label}
                                            </Text>
                                            <Text className={`ml-2 text-xs ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                                                {vibeCounts[filter.key]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="px-6 pt-4 pb-10">
                            {filteredRecipes.length === 0 ? (
                                <View className="bg-white border border-slate-100 rounded-2xl p-5 items-center">
                                    <Text className="text-slate-900 font-bold mb-1">No matches yet</Text>
                                    <Text className="text-slate-500 text-center">Try another vibe to see more saved recipes.</Text>
                                </View>
                            ) : (
                                filteredRecipes.map((recipe, index) => (
                                    <RecipeCard key={recipe.id || index} recipe={recipe} />
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
