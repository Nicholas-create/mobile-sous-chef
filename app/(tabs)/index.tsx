import { useRouter } from 'expo-router';
import { Calendar, Camera, Search } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 pt-6 pb-4">
                <Text className="text-slate-500 text-lg font-medium">Welcome back,</Text>
                <Text className="text-4xl font-bold text-slate-900 mt-1">Sous-Chef</Text>
            </View>

            <View className="flex-1 px-6 pb-32 pt-2">
                <View className="flex-1 flex-col gap-4">
                    {/* Planner */}
                    <TouchableOpacity
                        className="flex-1 bg-orange-50 border border-orange-100 rounded-[32px] p-5 justify-between relative overflow-hidden"
                        activeOpacity={0.9}
                        onPress={() => router.push('/planner')}
                    >
                        <View className="z-10">
                            <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mb-3">
                                <Search size={20} className="text-orange-600" color="#ea580c" />
                            </View>
                            <Text className="text-2xl font-bold text-slate-900">Planner</Text>
                            <Text className="text-slate-500 text-sm font-medium mt-1">I know what I want</Text>
                        </View>
                        <View className="absolute -bottom-6 -right-6 opacity-10">
                            <Search size={100} color="#ea580c" />
                        </View>
                    </TouchableOpacity>

                    {/* Scavenger */}
                    <TouchableOpacity
                        className="flex-1 bg-blue-50 border border-blue-100 rounded-[32px] p-5 justify-between relative overflow-hidden"
                        activeOpacity={0.9}
                        onPress={() => router.push('/scavenger')}
                    >
                        <View className="z-10">
                            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mb-3">
                                <Camera size={20} className="text-blue-600" color="#2563eb" />
                            </View>
                            <Text className="text-2xl font-bold text-slate-900">Scavenger</Text>
                            <Text className="text-slate-500 text-sm font-medium mt-1">Scan my fridge</Text>
                        </View>
                        <View className="absolute -bottom-6 -right-6 opacity-10">
                            <Camera size={100} color="#2563eb" />
                        </View>
                    </TouchableOpacity>

                    {/* Inspire Me (formerly Daily Menu) */}
                    <TouchableOpacity
                        className="flex-1 bg-green-50 border border-green-100 rounded-[32px] p-5 justify-between relative overflow-hidden"
                        activeOpacity={0.9}
                        onPress={() => router.push('/daily-menu')}
                    >
                        <View className="z-10 h-full justify-between">
                            <View>
                                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-3">
                                    <Calendar size={20} className="text-green-600" color="#16a34a" />
                                </View>
                                <Text className="text-2xl font-bold text-slate-900">Inspire Me</Text>
                                <Text className="text-slate-500 text-sm font-medium mt-1">Something new today</Text>
                            </View>

                            <View className="flex-row items-center space-x-2">
                                <Text className="text-green-700 font-bold">View Menu</Text>
                                <View className="bg-green-200 rounded-full p-1">
                                    <Search size={12} className="text-green-700" color="#15803d" />
                                </View>
                            </View>
                        </View>
                        <View className="absolute -bottom-8 -right-8 opacity-10">
                            <Calendar size={120} color="#16a34a" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
