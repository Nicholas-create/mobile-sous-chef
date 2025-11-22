const { onCall } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("firebase-functions/logger");
const { HttpsError } = require("firebase-functions/v2/https");

// Access the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

exports.generateRecipes = onCall({ cors: true }, async (request) => {
    try {
        const { prompt, modelName } = request.data;
        if (!prompt) {
            throw new HttpsError('invalid-argument', 'Missing prompt');
        }

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { text };
    } catch (error) {
        logger.error("Error generating recipes", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Error generating recipes', error.message);
    }
});

exports.generateRecipesFromImage = onCall({ cors: true }, async (request) => {
    try {
        const { prompt, imageBase64, modelName } = request.data;
        if (!prompt || !imageBase64) {
            throw new HttpsError('invalid-argument', 'Missing prompt or image');
        }

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const result = await model.generateContent([
            prompt,
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]);
        const text = result.response.text();

        return { text };
    } catch (error) {
        logger.error("Error generating recipes from image", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Error generating recipes from image', error.message);
    }
});

exports.generateDailyMenu = onCall({ cors: true }, async (request) => {
    try {
        const { prompt, modelName } = request.data;
        if (!prompt) {
            throw new HttpsError('invalid-argument', 'Missing prompt');
        }

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { text };
    } catch (error) {
        logger.error("Error generating daily menu", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Error generating daily menu', error.message);
    }
});

exports.chatWithAssistant = onCall({ cors: true }, async (request) => {
    try {
        const { history, message, modelName } = request.data;
        if (!message) {
            throw new HttpsError('invalid-argument', 'Missing message');
        }

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(message);
        const text = result.response.text();

        return { text };
    } catch (error) {
        logger.error("Error in chat", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Error in chat', error.message);
    }
});

exports.generateImage = onCall({ cors: true }, async (request) => {
    try {
        const { prompt, modelName } = request.data;
        if (!prompt) {
            throw new HttpsError('invalid-argument', 'Missing prompt');
        }

        // Imagen API via REST
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName || 'imagen-3.0-generate-001'}:predict`;

        const payload = {
            instances: [{ prompt }],
            parameters: { sampleCount: 1, aspectRatio: "1:1" }
        };

        const fetch = (await import('node-fetch')).default;
        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const err = await apiResponse.text();
            throw new Error(`Imagen API Error: ${err}`);
        }

        const data = await apiResponse.json();

        // Extract base64
        let base64 = null;
        if (data.predictions?.[0]?.bytesBase64Encoded) {
            base64 = data.predictions[0].bytesBase64Encoded;
        }

        return { base64 };
    } catch (error) {
        logger.error("Error generating image", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Error generating image', error.message);
    }
});
