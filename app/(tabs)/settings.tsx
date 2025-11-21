import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';

export default function Preferences() {
    const router = useRouter();
    const { measurementSystem, setMeasurementSystem } = useApp();

    return (
        <View className="flex-1 bg-slate-50">

            <View className="px-6 pt-6">
                <View className="bg-white p-4 rounded-2xl flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-lg font-bold text-slate-900">Measurement System</Text>
                        <Text className="text-slate-500">Use {measurementSystem} units</Text>
                    </View>
                    <View className="flex-row items-center bg-slate-100 rounded-lg p-1">
                        <TouchableOpacity
                            className={`px-3 py-2 rounded-md ${measurementSystem === 'metric' ? 'bg-white shadow-sm' : ''}`}
                            onPress={() => setMeasurementSystem('metric')}
                        >
                            <Text className={`${measurementSystem === 'metric' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>Metric</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`px-3 py-2 rounded-md ${measurementSystem === 'imperial' ? 'bg-white shadow-sm' : ''}`}
                            onPress={() => setMeasurementSystem('imperial')}
                        >
                            <Text className={`${measurementSystem === 'imperial' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>Imperial</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-white p-4 rounded-2xl mb-4">
                    <Text className="text-lg font-bold text-slate-900 mb-2">About</Text>
                    <Text className="text-slate-500">Mobile Sous-Chef v1.0.0</Text>
                    <Text className="text-slate-500">Powered by Gemini AI</Text>
                </View>
            </View>
        </View>
    );
}
