import { useRouter } from 'expo-router';
import { Calendar, Camera, Search, Sparkles } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 pt-6 pb-2">
                    <Text className="text-slate-500 text-lg font-medium">Welcome back,</Text>
                    <Text className="text-4xl font-black text-slate-900 mt-1">Sous-Chef</Text>
                    <View className="mt-3 bg-white border border-slate-100 rounded-3xl p-4 flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                            <Text className="text-slate-900 font-semibold text-sm">Tonight&apos;s flow</Text>
                            <Text className="text-slate-500 text-sm mt-1">Pick the path that fits your mood.</Text>
                        </View>
                        <View className="w-10 h-10 rounded-2xl bg-orange-100 items-center justify-center">
                            <Sparkles size={20} color="#f97316" />
                        </View>
                    </View>
                </View>

                <View className="px-6 pt-4">
                    <TouchableOpacity
                        className="bg-white border border-orange-100 rounded-[32px] p-5 overflow-hidden mb-4"
                        activeOpacity={0.9}
                        onPress={() => router.push('/planner')}
                    >
                        <View className="absolute -right-8 -top-10 h-28 w-28 bg-orange-50 rounded-full" />
                        <View className="z-10">
                            <View className="w-12 h-12 rounded-2xl bg-orange-500/10 items-center justify-center mb-3">
                                <Search size={22} color="#ea580c" />
                            </View>
                            <Text className="text-2xl font-black text-slate-900">Planner</Text>
                            <Text className="text-slate-600 text-sm mt-2 leading-snug">
                                I know what I want—help me dial it in quickly.
                            </Text>
                            <Text className="text-orange-700 text-sm font-semibold mt-3">Start planning →</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-white border border-blue-100 rounded-[32px] p-5 overflow-hidden mb-4"
                        activeOpacity={0.9}
                        onPress={() => router.push('/scavenger')}
                    >
                        <View className="absolute -right-8 -top-10 h-28 w-28 bg-blue-50 rounded-full" />
                        <View className="z-10">
                            <View className="w-12 h-12 rounded-2xl bg-blue-500/10 items-center justify-center mb-3">
                                <Camera size={22} color="#2563eb" />
                            </View>
                            <Text className="text-2xl font-black text-slate-900">Scavenger</Text>
                            <Text className="text-slate-600 text-sm mt-2 leading-snug">
                                Snap what is in the fridge, get balanced recipe picks.
                            </Text>
                            <Text className="text-blue-700 text-sm font-semibold mt-3">Open camera →</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-white border border-emerald-100 rounded-[32px] p-5 overflow-hidden mb-6"
                        activeOpacity={0.9}
                        onPress={() => router.push('/daily-menu')}
                    >
                        <View className="absolute -right-8 -top-10 h-28 w-28 bg-emerald-50 rounded-full" />
                        <View className="z-10">
                            <View className="w-12 h-12 rounded-2xl bg-emerald-500/10 items-center justify-center mb-3">
                                <Calendar size={22} color="#16a34a" />
                            </View>
                            <Text className="text-2xl font-black text-slate-900">Inspire Me</Text>
                            <Text className="text-slate-600 text-sm mt-2 leading-snug">
                                A chef-curated set for today—no browsing needed.
                            </Text>
                            <Text className="text-emerald-700 text-sm font-semibold mt-3">View menu →</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
