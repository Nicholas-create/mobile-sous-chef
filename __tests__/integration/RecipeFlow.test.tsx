import { httpsCallable } from 'firebase/functions';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';

// Mock dependencies
jest.mock('../../services/storageService');
jest.mock('firebase/functions');
jest.mock('../../utils/apiUtils', () => ({
    withRetry: jest.fn((fn) => fn()),
}));

describe('GeminiService (Cloud) Integration', () => {
    const mockHttpsCallable = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (httpsCallable as jest.Mock).mockReturnValue(mockHttpsCallable);
    });

    it('should call cloud function and save recipes to storage', async () => {
        // Mock successful response from Cloud Function
        mockHttpsCallable.mockResolvedValue({
            data: {
                text: JSON.stringify([{
                    id: '123',
                    title: 'Cloud Recipe',
                    description: 'Delicious from cloud',
                    prepTime: '10m',
                    cookTime: '20m',
                    servings: 2,
                    calories: 500,
                    ingredients: [],
                    steps: [],
                    tags: []
                }])
            }
        });

        // Call the service
        const recipes = await GeminiService.generateRecipesFromText('pasta', 'metric');

        // Assertions
        expect(recipes).toHaveLength(1);
        expect(recipes[0].title).toBe('Cloud Recipe');

        // Verify StorageService was called
        expect(StorageService.saveRecipes).toHaveBeenCalledTimes(1);
    });
});
