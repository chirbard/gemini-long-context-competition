import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import legalDocumentFile from "../../data/pohiseadus.txt";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class APIKeyRotator {
  constructor(keys) {
    this.keys = keys;
  }

  // Rotate the API key
  getRandomKey() {
    const randomIndex = Math.floor(Math.random() * this.keys.length);
    return this.keys[randomIndex];
  }

  async getGenerativeAIModelWithRetry(messageHistory, prompt) {
    const attemptedKeys = new Set();

    while (attemptedKeys.size < this.keys.length) {
      const apiKey = this.getRandomKey();

      if (attemptedKeys.has(apiKey)) continue;
      attemptedKeys.add(apiKey);

      const genAI = new GoogleGenerativeAI(apiKey);

      const fileMessage = {
        role: "user",
        parts: [{ text: legalDocumentFile }],
      };

      messageHistory.unshift(fileMessage);

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const systemInstruction: Content = {
          role: "system",
          parts: [
            {
              text: "Sinu nimi on juur.ai. Sa oled seaduste abiline ja sulle on antud üks seadus. Vasta kasutajale kasutades seda seadust",
            },
          ],
        };

        const chat = model.startChat({
          history: messageHistory,
          systemInstruction: systemInstruction,
        });
        const response = await chat.sendMessage(prompt);

        if (response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log("Successful response received.");
          return response.response.candidates[0].content.parts[0].text;
        } else {
          console.error(`Received empty response with API key`);
        }
      } catch (error) {
        console.error(`Error with API key: `, error);

        if (error?.message?.includes("429")) {
          console.log("Received 429 error, retrying with backoff...");
          const delay = Math.pow(2, i) * 100; // Exponential backoff
          console.log(`Retry delay: ${delay}ms`);
          await sleep(delay);
        } else if (error?.message?.includes("401")) {
          console.error("Unauthorized - Invalid or expired API key.");
        } else if (error?.message?.includes("400")) {
          console.error("Bad request - Invalid request parameters.");
          throw error;
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

  if (!body || !body.messageHistory || !body.prompt) {
    throw createError({
      statusCode: 400,
      message: "Message History and prompt is required",
    });
  }

  const messageHistoryJSON: string = body.messageHistory;
  const messageHistory = JSON.parse(messageHistoryJSON);

  const apiKeyRotator = new APIKeyRotator([
    config.googleApiKey1,
    config.googleApiKey2,
    config.googleApiKey3,
    config.googleApiKey4,
    config.googleApiKey5,
    config.googleApiKey6,
  ]);

  try {
    const responseText = await apiKeyRotator.getGenerativeAIModelWithRetry(
      messageHistory,
      body.prompt
    );

    return { response: responseText };
  } catch (error) {
    console.error("Load balancing failed:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to generate response from Google Generative AI.",
    });
  }
});
