export const AI_MODELS = {
    geminiFlash: 'gemini-2.5-flash',
    geminiPro: 'gemini-3-pro-preview',
};

export const AI_CONFIG = {
    // Map specific features to models
    textToRecipe: AI_MODELS.geminiFlash,
    imageToRecipe: AI_MODELS.geminiFlash,
    dailyMenu: AI_MODELS.geminiFlash,
    chatAssistant: AI_MODELS.geminiFlash,
};
