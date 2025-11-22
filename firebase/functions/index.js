const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("firebase-functions/logger");

// Access the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const cors = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return true;
    }
    return false;
};

exports.generateRecipes = onRequest(async (request, response) => {
    if (cors(request, response)) return;

    try {
        const { prompt, modelName } = request.body;
        if (!prompt) return response.status(400).send('Missing prompt');

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        response.status(200).json({ text });
    } catch (error) {
        logger.error("Error generating recipes", error);
        response.status(500).send("Internal Server Error");
    }
});

exports.generateRecipesFromImage = onRequest(async (request, response) => {
    if (cors(request, response)) return;

    try {
        const { prompt, imageBase64, modelName } = request.body;
        if (!prompt || !imageBase64) return response.status(400).send('Missing prompt or image');

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const result = await model.generateContent([
            prompt,
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]);
        const text = result.response.text();

        response.status(200).json({ text });
    } catch (error) {
        logger.error("Error generating recipes from image", error);
        response.status(500).send("Internal Server Error");
    }
});

exports.generateDailyMenu = onRequest(async (request, response) => {
    if (cors(request, response)) return;

    try {
        const { prompt, modelName } = request.body;
        if (!prompt) return response.status(400).send('Missing prompt');

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        response.status(200).json({ text });
    } catch (error) {
        logger.error("Error generating daily menu", error);
        response.status(500).send("Internal Server Error");
    }
});

exports.chatWithAssistant = onRequest(async (request, response) => {
    if (cors(request, response)) return;

    try {
        const { history, message, modelName } = request.body;
        if (!message) return response.status(400).send('Missing message');

        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(message);
        const text = result.response.text();

        response.status(200).json({ text });
    } catch (error) {
        logger.error("Error in chat", error);
        response.status(500).send("Internal Server Error");
    }
});

exports.generateImage = onRequest(async (request, response) => {
    if (cors(request, response)) return;

    try {
        const { prompt, modelName } = request.body;
        if (!prompt) return response.status(400).send('Missing prompt');

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

        response.status(200).json({ base64 });
    } catch (error) {
        logger.error("Error generating image", error);
        response.status(500).send("Internal Server Error");
    }
});
