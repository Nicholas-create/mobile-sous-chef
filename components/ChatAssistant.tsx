import { Send, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GeminiService } from '../services/geminiService';

interface ChatAssistantProps {
    onClose: () => void;
    context: string; // Recipe context
}

export default function ChatAssistant({ onClose, context }: ChatAssistantProps) {
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([
        { role: 'model', text: 'I am your Sous-Chef. Ask me anything about this recipe!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Prepare history for Gemini
    // Gemini expects { role: 'user' | 'model', parts: [{ text: string }] }
    const getHistory = () => {
        // Prepend context as a system-like user message if needed, or just rely on the chat session
        // For simplicity, we'll just send the history as is, but we should probably prime it.
        // Actually GeminiService.chatWithAssistant takes the history.
        // We need to format it correctly.
        return [
            { role: 'user', parts: [{ text: `You are a cooking assistant. Context: ${context}` }] },
            ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : m.role, parts: [{ text: m.text }] }))
        ];
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            // We need to map our simple message structure to Gemini's history structure
            // Note: The first message "I am your Sous-Chef" is a model message.
            // We should probably construct a fresh history for the API call.
            const history = [
                { role: 'user', parts: [{ text: `You are a helpful cooking assistant. The user is cooking this recipe: ${context}. Answer their questions briefly and helpfully.` }] },
                { role: 'model', parts: [{ text: 'Understood. I am ready to help with the recipe.' }] },
                ...messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] }))
            ];

            // Remove the last user message we just added from history array passed to startChat if we use sendMessage, 
            // BUT GeminiService.chatWithAssistant uses startChat with history.
            // Actually, `chat.sendMessage` appends the new message.
            // So we pass the history of *previous* messages.

            const historyForChat = history.slice(0, -1); // Exclude the new user message? No, `sendMessage` takes the new message.
            // Wait, `startChat` takes `history`. Then we call `sendMessage(userMsg)`.
            // So `history` should NOT include `userMsg`.

            const response = await GeminiService.chatWithAssistant(history, userMsg);
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the kitchen server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white rounded-t-3xl shadow-xl">
            <View className="flex-row justify-between items-center p-4 border-b border-slate-100">
                <Text className="text-lg font-bold text-slate-900">Sous-Chef Assistant</Text>
                <TouchableOpacity onPress={onClose}>
                    <X color="#0f172a" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                {messages.map((msg, index) => (
                    <View key={index} className={`mb-4 max-w-[80%] ${msg.role === 'user' ? 'self-end bg-orange-100' : 'self-start bg-slate-100'} p-3 rounded-2xl`}>
                        <Text className="text-slate-800">{msg.text}</Text>
                    </View>
                ))}
                {loading && (
                    <View className="self-start bg-slate-100 p-3 rounded-2xl mb-4">
                        <ActivityIndicator size="small" color="#ea580c" />
                    </View>
                )}
            </ScrollView>

            <View className="p-4 border-t border-slate-100 flex-row items-center">
                <TextInput
                    className="flex-1 bg-slate-50 p-3 rounded-xl mr-2 border border-slate-200"
                    placeholder="Ask a question..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity onPress={handleSend} disabled={loading} className="bg-orange-600 p-3 rounded-xl">
                    <Send color="white" size={20} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
