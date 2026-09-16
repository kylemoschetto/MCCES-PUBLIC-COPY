/**
 * Google Gemini Provider Adapter
 */
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import {
  AIProviderAdapter,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  ProviderConfig,
  DEFAULT_MODELS,
} from './types';

export class GoogleAdapter implements AIProviderAdapter {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(config: ProviderConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || DEFAULT_MODELS.google;
  }

  getName(): 'google' {
    return 'google';
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.google;
  }

  getModel(): string {
    return this.model;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system');
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    // Build system instruction with optional JSON format
    let systemInstruction = systemMessage?.content;
    if (options?.responseFormat === 'json') {
      const jsonInstruction =
        '\n\nIMPORTANT: You MUST respond with valid JSON only. No other text before or after the JSON.';
      systemInstruction = systemInstruction ? systemInstruction + jsonInstruction : jsonInstruction;
    }

    // Initialize model with configuration
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 4096,
        responseMimeType: options?.responseFormat === 'json' ? 'application/json' : 'text/plain',
      },
    });

    // Convert messages to Gemini format (history + current message)
    const history: Content[] = [];
    let currentMessage = '';

    for (let i = 0; i < nonSystemMessages.length; i++) {
      const msg = nonSystemMessages[i];
      if (i === nonSystemMessages.length - 1 && msg.role === 'user') {
        // Last user message becomes the prompt
        currentMessage = msg.content;
      } else {
        history.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Start chat with history
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(currentMessage);
    const response = result.response;

    const text = response.text();
    if (!text) {
      throw new Error('No response from Google Gemini');
    }

    // Google doesn't provide token counts in the same way, estimate from response
    const usageMetadata = response.usageMetadata;

    return {
      content: text,
      usage: usageMetadata
        ? {
            promptTokens: usageMetadata.promptTokenCount || 0,
            completionTokens: usageMetadata.candidatesTokenCount || 0,
            totalTokens: usageMetadata.totalTokenCount || 0,
          }
        : undefined,
    };
  }
}
