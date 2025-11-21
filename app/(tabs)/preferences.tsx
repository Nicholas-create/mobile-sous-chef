import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../context/AppContext';

export default function Preferences() {
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
                        <Pressable
                            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: measurementSystem === 'metric' ? 'white' : 'transparent' }}
                            onPress={() => setMeasurementSystem('metric')}
                        >
                            <Text style={{ color: measurementSystem === 'metric' ? '#0f172a' : '#64748b', fontWeight: measurementSystem === 'metric' ? 'bold' : 'normal' }}>Metric</Text>
                        </Pressable>
                        <Pressable
                            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: measurementSystem === 'imperial' ? 'white' : 'transparent' }}
                            onPress={() => setMeasurementSystem('imperial')}
                        >
                            <Text style={{ color: measurementSystem === 'imperial' ? '#0f172a' : '#64748b', fontWeight: measurementSystem === 'imperial' ? 'bold' : 'normal' }}>Imperial</Text>
                        </Pressable>
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
