import { useRouter } from 'expo-router';
import { BookOpen, Calendar, Camera, Search, Settings, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const router = useRouter();

    const features = [
        {
            id: 'planner',
            title: 'Planner',
            subtitle: 'I know what I want',
            icon: Search,
            route: '/planner',
            color: 'bg-orange-100',
            iconColor: '#ea580c' // orange-600
        },
        {
            id: 'scavenger',
            title: 'Scavenger',
            subtitle: 'Scan my fridge',
            icon: Camera,
            route: '/scavenger',
            color: 'bg-blue-100',
            iconColor: '#2563eb' // blue-600
        },
        {
            id: 'daily-menu',
            title: 'Daily Menu',
            subtitle: 'Inspire me',
            icon: Calendar,
            route: '/daily-menu', // Will handle logic inside or separate route? Prompt says "Daily Menu" is a card. I'll make a route or handle it. Prompt says "Prompt 3: Daily Menu". I'll create a route for it or use planner with params. Let's create a route `/daily-menu` (not explicitly asked for file but implied by functionality). Or maybe just a modal? I'll make it a page `app/daily-menu.tsx` to be safe, or handle in `planner`?
            // "Prompt 3: Daily Menu (Indecisive)" -> "app/index.tsx ... Daily Menu: (Icon: Calendar) 'Inspire me'".
            // I'll create `app/daily-menu.tsx` for this feature.
            color: 'bg-green-100',
            iconColor: '#16a34a' // green-600
        },
        {
            id: 'cookbook',
            title: 'Cookbook',
            subtitle: 'Saved recipes',
            icon: BookOpen,
            route: '/cookbook', // "app/index.tsx ... Cookbook ... Saved recipes". I'll create `app/cookbook.tsx`.
            color: 'bg-purple-100',
            iconColor: '#9333ea' // purple-600
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-row justify-between items-center px-6 py-4">
                <Text className="text-3xl font-bold text-slate-900">Sous-Chef</Text>
                <View className="flex-row space-x-4">
                    <TouchableOpacity onPress={() => router.push('/shopping-list')}>
                        <ShoppingBag color="#334155" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/preferences')}>
                        <Settings color="#334155" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-4">
                <View className="flex-col space-y-4 pb-10">
                    {features.map((feature) => (
                        <TouchableOpacity
                            key={feature.id}
                            className={`w-full p-6 rounded-3xl ${feature.color} flex-row items-center justify-between h-32`}
                            onPress={() => router.push(feature.route as any)}
                        >
                            <View>
                                <Text className="text-2xl font-bold text-slate-800">{feature.title}</Text>
                                <Text className="text-slate-600 mt-1">{feature.subtitle}</Text>
                            </View>
                            <feature.icon size={40} color={feature.iconColor} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
