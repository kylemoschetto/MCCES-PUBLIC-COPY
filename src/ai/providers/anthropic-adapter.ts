/**
 * Anthropic Provider Adapter
 */
import Anthropic from '@anthropic-ai/sdk';
import {
  AIProviderAdapter,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  ProviderConfig,
  DEFAULT_MODELS,
} from './types';

export class AnthropicAdapter implements AIProviderAdapter {
  private client: Anthropic;
  private model: string;

  constructor(config: ProviderConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model || DEFAULT_MODELS.anthropic;
  }

  getName(): 'anthropic' {
    return 'anthropic';
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.anthropic;
  }

  getModel(): string {
    return this.model;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system');
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    // Convert messages to Anthropic format
    const anthropicMessages = nonSystemMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Build request with optional JSON format instruction
    let system = systemMessage?.content;
    if (options?.responseFormat === 'json') {
      const jsonInstruction =
        '\n\nIMPORTANT: You MUST respond with valid JSON only. No other text before or after the JSON.';
      system = system ? system + jsonInstruction : jsonInstruction;
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens ?? 4096,
      messages: anthropicMessages,
      system,
      temperature: options?.temperature ?? 0.7,
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Anthropic');
    }

    return {
      content: textContent.text,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }
}
