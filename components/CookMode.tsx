import { ChevronLeft, ChevronRight, Layers, List, MessageCircle, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Recipe } from '../types';
import ChatAssistant from './ChatAssistant';

interface CookModeProps {
    visible: boolean;
    onClose: () => void;
    recipe: Recipe;
}

const { width } = Dimensions.get('window');

export default function CookMode({ visible, onClose, recipe }: CookModeProps) {
    const [viewMode, setViewMode] = useState<'step' | 'list'>('step');
    const [currentStep, setCurrentStep] = useState(0);
    const [chatVisible, setChatVisible] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        if (slide !== currentStep) {
            setCurrentStep(slide);
        }
    };

    const nextStep = () => {
        if (currentStep < recipe.steps.length - 1) {
            scrollRef.current?.scrollTo({ x: (currentStep + 1) * width, animated: true });
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            scrollRef.current?.scrollTo({ x: (currentStep - 1) * width, animated: true });
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
            <View className="flex-1 bg-slate-900">
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4 pt-12 bg-slate-900">
                    <TouchableOpacity onPress={onClose} className="bg-slate-800 p-2 rounded-full">
                        <X color="white" size={24} />
                    </TouchableOpacity>
                    <View className="flex-row bg-slate-800 rounded-full p-1">
                        <TouchableOpacity
                            className={`px-4 py-2 rounded-full ${viewMode === 'step' ? 'bg-orange-600' : 'bg-transparent'}`}
                            onPress={() => setViewMode('step')}
                        >
                            <Layers color={viewMode === 'step' ? 'white' : '#94a3b8'} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`px-4 py-2 rounded-full ${viewMode === 'list' ? 'bg-orange-600' : 'bg-transparent'}`}
                            onPress={() => setViewMode('list')}
                        >
                            <List color={viewMode === 'list' ? 'white' : '#94a3b8'} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {/* Content */}
                <View className="flex-1">
                    {viewMode === 'step' ? (
                        <View className="flex-1 justify-center">
                            <ScrollView
                                ref={scrollRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={handleScroll}
                                scrollEventThrottle={16}
                            >
                                {recipe.steps.map((step, index) => (
                                    <View key={index} style={{ width }} className="px-8 justify-center">
                                        <Text className="text-orange-500 font-bold text-xl mb-4">STEP {index + 1}</Text>
                                        <Text className="text-white text-3xl font-bold leading-tight">{step}</Text>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Navigation Controls */}
                            <View className="flex-row justify-between px-8 pb-10">
                                <TouchableOpacity onPress={prevStep} disabled={currentStep === 0}>
                                    <ChevronLeft color={currentStep === 0 ? '#334155' : 'white'} size={40} />
                                </TouchableOpacity>
                                <Text className="text-slate-400 text-lg">{currentStep + 1} / {recipe.steps.length}</Text>
                                <TouchableOpacity onPress={nextStep} disabled={currentStep === recipe.steps.length - 1}>
                                    <ChevronRight color={currentStep === recipe.steps.length - 1 ? '#334155' : 'white'} size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <ScrollView className="flex-1 px-6 pt-6">
                            <Text className="text-white text-2xl font-bold mb-6">All Steps</Text>
                            {recipe.steps.map((step, index) => (
                                <View key={index} className="flex-row mb-6">
                                    <View className="w-8 h-8 rounded-full bg-orange-600 items-center justify-center mr-4 mt-1">
                                        <Text className="text-white font-bold">{index + 1}</Text>
                                    </View>
                                    <Text className="text-slate-300 text-lg flex-1 leading-relaxed">{step}</Text>
                                </View>
                            ))}
                            <View className="h-20" />
                        </ScrollView>
                    )}
                </View>

                {/* Chat Assistant Button */}
                <TouchableOpacity
                    className="absolute bottom-10 right-6 bg-orange-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                    onPress={() => setChatVisible(true)}
                >
                    <MessageCircle color="white" size={28} />
                </TouchableOpacity>

                {/* Chat Overlay */}
                <Modal visible={chatVisible} animationType="slide" transparent>
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="h-[60%]">
                            <ChatAssistant
                                onClose={() => setChatVisible(false)}
                                context={`Recipe: ${recipe.title}. Steps: ${recipe.steps.join(' ')}. Ingredients: ${recipe.ingredients.map(i => i.name).join(', ')}`}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    );
}
