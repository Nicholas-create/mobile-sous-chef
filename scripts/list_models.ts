import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('API Key not found in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // Note: listModels is not directly on GoogleGenerativeAI instance in some versions, 
        // but usually accessed via a ModelManager or similar if exposed, 
        // or we can try to just use a known model to list others if possible, 
        // but the SDK usually has a way.
        // Actually, the SDK might not expose listModels directly in the helper.
        // Let's try to use the API directly if the SDK doesn't support it easily in this version.
        // But wait, the error message suggested "Call ListModels".

        // Let's try a direct fetch to the API endpoint for listing models.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log('No models found or error:', data);
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
