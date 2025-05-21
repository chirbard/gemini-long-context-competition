import {
  Content,
  GoogleGenerativeAI,
  StartChatParams,
} from '@google/generative-ai';
import fs from 'fs';
import legalDocumentFile from '../../data/pohiseadus.txt';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { messageHistory, prompt } = parseRequestBody(body);

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
      prompt
    );

    return { response: responseText };
  } catch (error) {
    console.error('Load balancing failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to generate response from Google Generative AI.',
    });
  }
});

function parseRequestBody(body: any) {
  if (!body || !body.messageHistory || !body.prompt) {
    throw createError({
      statusCode: 400,
      message: 'Message History and prompt is required',
    });
  }

  const messageHistoryJSON: string = body.messageHistory;
  const messageHistory = JSON.parse(messageHistoryJSON);

  return { messageHistory, prompt: body.prompt };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class APIKeyRotator {
  unusedKeys: string[];
  usedKeys: Set<string> = new Set();
  systemInstructionString: string =
    'Sinu nimi on juur.ai. Sa oled seaduste abiline ja sulle on antud eesti seadused. Vasta kasutajale kasutades neid seadusi ja viita alati, kust sa info võtsid.';

  constructor(keys: string[]) {
    this.unusedKeys = keys;
  }

  // Rotate the API key
  getRandomKey() {
    const randomIndex = Math.floor(Math.random() * this.unusedKeys.length);
    const selectedKey = this.unusedKeys[randomIndex];
    this.usedKeys.add(selectedKey);
    this.unusedKeys.splice(randomIndex, 1);
    return selectedKey;
  }

  async getGenerativeAIModelWithRetry(messageHistory: any, prompt: any) {
    while (this.unusedKeys.length != 0) {
      const apiKey = this.getRandomKey();

      const genAI = new GoogleGenerativeAI(apiKey);

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // const tokenCount = await model.countTokens(legalDocumentFile);
        // console.log('Token count:', tokenCount);

        const chat = model.startChat(
          this.createChatStartParameters(messageHistory)
        );

        // console.log('Chat initialized with message history:', messageHistory);

        const response = await chat.sendMessage(prompt);

        if (response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log('Successful response received.');
          return response.response.candidates[0].content.parts[0].text;
        } else {
          console.error(`Received empty response with API key`);
        }
      } catch (error) {
        console.error(`Error with API key: `, error);

        if (error?.message?.includes('429')) {
          console.log(
            'Received 429 error, quota for this key reached, trying next key...'
          );
        } else if (error?.message?.includes('401')) {
          console.error(
            'Unauthorized - Invalid or expired API key. Trying next key...'
          );
        } else if (error?.message?.includes('403')) {
          console.error('Forbidden - Access denied. Trying next key...');
        } else if (error?.message?.includes('400')) {
          console.error(
            'Bad request - Invalid request parameters. Cancelling...'
          );
          throw error;
        } else {
          console.error('Unknown error occurred.');
          throw error;
        }
      }
    }

    console.error('All keys have failed. No responses were successful.');
    throw new Error('All API keys failed after retries.');
  }

  createChatStartParameters(messageHistory: any): StartChatParams {
    const fileMessage = {
      role: 'user',
      parts: [{ text: legalDocumentFile }],
    };

    messageHistory.unshift(fileMessage); // Add the legal document to the beginning of the message history

    const systemInstruction: Content = {
      role: 'system',
      parts: [
        {
          text: this.systemInstructionString,
        },
      ],
    };

    return {
      history: messageHistory,
      systemInstruction: systemInstruction,
    };
  }
}
