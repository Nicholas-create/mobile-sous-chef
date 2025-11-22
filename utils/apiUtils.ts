export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoff = 2
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;

        console.log(`Retrying operation... Attempts left: ${retries}. Waiting ${delay}ms.`);
        await wait(delay);

        return withRetry(fn, retries - 1, delay * backoff, backoff);
    }
}

export const cleanJsonString = (text: string): string => {
    return text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
};
