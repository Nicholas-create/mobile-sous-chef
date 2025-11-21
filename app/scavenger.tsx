import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { useApp } from '../context/AppContext';
import { GeminiService } from '../services/geminiService';
import { Recipe } from '../types';

export default function Scavenger() {
    const router = useRouter();
    const { measurementSystem } = useApp();
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const pickImage = async (useCamera: boolean) => {
        let result;
        if (useCamera) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (permission.granted === false) {
                alert("Permission to access camera is required!");
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                base64: true,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                base64: true,
            });
        }

        if (!result.canceled && result.assets && result.assets[0].base64) {
            setImage(result.assets[0].uri);
            analyzeImage(result.assets[0].base64);
        }
    };

    const analyzeImage = async (base64: string) => {
        setLoading(true);
        try {
            const results = await GeminiService.generateRecipesFromImage(base64, measurementSystem);
            setRecipes(results);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50">

            <ScrollView className="flex-1 px-6 pt-6">
                <View className="bg-white p-6 rounded-3xl border border-slate-200 items-center justify-center mb-8 min-h-[200px]">
                    {image ? (
                        <Image source={{ uri: image }} className="w-full h-64 rounded-2xl" resizeMode="cover" />
                    ) : (
                        <View className="items-center">
                            <Camera size={48} color="#cbd5e1" />
                            <Text className="text-slate-400 mt-2 text-center">Take a photo of your fridge or pantry</Text>
                        </View>
                    )}
                </View>

                <View className="flex-row space-x-4 mb-8">
                    <TouchableOpacity
                        className="flex-1 bg-orange-600 py-4 rounded-2xl flex-row justify-center items-center"
                        onPress={() => pickImage(true)}
                        disabled={loading}
                    >
                        <Camera color="white" size={20} className="mr-2" />
                        <Text className="text-white font-bold">Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 bg-slate-200 py-4 rounded-2xl flex-row justify-center items-center"
                        onPress={() => pickImage(false)}
                        disabled={loading}
                    >
                        <Upload color="#334155" size={20} className="mr-2" />
                        <Text className="text-slate-700 font-bold">Gallery</Text>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View className="py-10 items-center">
                        <ActivityIndicator size="large" color="#ea580c" />
                        <Text className="text-slate-500 mt-4">Analyzing ingredients...</Text>
                    </View>
                )}

                {recipes.length > 0 && (
                    <View className="pb-10">
                        <Text className="text-xl font-bold text-slate-900 mb-4">Suggestions</Text>
                        {recipes.map((recipe, index) => (
                            <RecipeCard key={index} recipe={recipe} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
