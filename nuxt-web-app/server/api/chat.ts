import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to simulate sleep with exponential backoff
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class APIKeyRotator {
    constructor(keys) {
        this.keys = keys;
        this.currentIndex = 0;
    }

    // Rotate the API key
    getNextKey() {
        const key = this.keys[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        return key;
    }

    async getGenerativeAIModelWithRetry(prompt) {
        for (let i = 0; i < this.keys.length; i++) {
            const apiKey = this.getNextKey();

            console.log(`Attempting with ${i + 1}. API key`);

            const genAI = new GoogleGenerativeAI(apiKey);

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const response = await model.generateContent(prompt);

                if (response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.log("Successful response received.");
                    return response.response.candidates[0].content.parts[0].text;
                } else {
                    console.error(`Received empty response with ${i + 1}. API key`);
                }
            } catch (error) {
                console.error(`Error with ${i + 1}. API key:`, error);

                if (error?.message?.includes("429")) {
                    console.log("Received 429 error, retrying with backoff...");
                    const delay = Math.pow(2, i) * 100; // Exponential backoff
                    console.log(`Retry delay: ${delay}ms`);
                    await sleep(delay);
                } else if (error?.message?.includes("401")) {
                    console.error("Unauthorized - Invalid or expired API key.");
                } else {
                    console.error("Unknown error occurred.");
                }
            }
        }

        console.error("All keys have failed. No responses were successful.");
        throw new Error("All API keys failed after retries.");
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    if (!body || !body.prompt) {
        throw createError({ statusCode: 400, message: "Prompt is required" });
    }

    const apiKeyRotator = new APIKeyRotator([
        config.googleApiKey1,
        config.googleApiKey2,
        config.googleApiKey3,
        config.googleApiKey4,
        config.googleApiKey5,
        config.googleApiKey6,
    ]);

    try {
        const responseText = await apiKeyRotator.getGenerativeAIModelWithRetry(body.prompt);

        return { response: responseText };
    } catch (error) {
        console.error("Load balancing failed:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to generate response from Google Generative AI.",
        });
    }
});
