import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Helper to simulate sleep with exponential backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  async getGenerativeAIModelWithRetry(messageHistory, prompt) {
    for (let i = 0; i < this.keys.length; i++) {
      const apiKey = this.getNextKey();
      console.log(`Attempting with ${i + 1}. API key`);

      const genAI = new GoogleGenerativeAI(apiKey);

      let legalDocumentFile: string = "";

      try {
        legalDocumentFile = fs.readFileSync("./data/pohiseadus.txt", "utf-8");
      } catch (error: any) {
        if (error.code === "ENOENT") {
          legalDocumentFile = fs.readFileSync(
            "./nuxt-web-app/data/pohiseadus.txt",
            "utf-8"
          );
        } else {
          throw error;
        }
      }

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
          console.error(`Received empty response with ${i + 1}. API key`);
        }
      } catch (error) {
        console.error(`Error with API key ${apiKey}:`, error);

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
