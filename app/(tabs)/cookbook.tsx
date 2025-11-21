import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../components/RecipeCard';
import { useApp } from '../../context/AppContext';

export default function Cookbook() {
    const router = useRouter();
    const { savedRecipes } = useApp();

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 py-4 flex-row items-center space-x-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color="#0f172a" size={24} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-slate-900">Cookbook</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-4">
                {savedRecipes.length === 0 ? (
                    <View className="py-20 items-center">
                        <Text className="text-slate-400 text-lg text-center">No saved recipes yet.</Text>
                        <Text className="text-slate-400 text-center mt-2">Heart a recipe to save it here!</Text>
                    </View>
                ) : (
                    <View className="pb-10">
                        {savedRecipes.map((recipe, index) => (
                            <RecipeCard key={recipe.id || index} recipe={recipe} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
