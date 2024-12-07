import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event); // Read incoming JSON body

    if (!body || !body.prompt) {
        throw createError({ statusCode: 400, message: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(config.googleApiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Send the user's prompt to the Google Generative AI API
        const response = await model.generateContent(body.prompt);

        return { response: response.response.candidates?.[0].content.parts?.[0].text };
    } catch (error) {
        console.error("Error interacting with Generative AI:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to generate response from Google Generative AI.",
        });
    }
});
