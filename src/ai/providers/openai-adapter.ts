/**
 * OpenAI Provider Adapter
 */
import OpenAI from 'openai';
import {
  AIProviderAdapter,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  ProviderConfig,
  DEFAULT_MODELS,
} from './types';

export class OpenAIAdapter implements AIProviderAdapter {
  private client: OpenAI;
  private model: string;

  constructor(config: ProviderConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model || DEFAULT_MODELS.openai;
  }

  getName(): 'openai' {
    return 'openai';
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.openai;
  }

  getModel(): string {
    return this.model;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      response_format: options?.responseFormat === 'json' ? { type: 'json_object' } : undefined,
    });

    const choice = response.choices[0];
    if (!choice || !choice.message.content) {
      throw new Error('No response from OpenAI');
    }

    return {
      content: choice.message.content,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }
}
