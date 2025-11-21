import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import RecipeCard from '../../components/RecipeCard';
import { useApp } from '../../context/AppContext';

export default function Cookbook() {
    const router = useRouter();
    const { savedRecipes } = useApp();

    return (
        <View className="flex-1 bg-slate-50">

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
        </View>
    );
}
