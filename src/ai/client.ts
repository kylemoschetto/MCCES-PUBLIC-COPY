/**
 * AI Client - Multi-provider wrapper for AI services
 */
import {
  AIProvider,
  AIProviderAdapter,
  ChatMessage,
  ChatResponse,
  DEFAULT_MODELS,
  AVAILABLE_MODELS,
  OpenAIAdapter,
  AnthropicAdapter,
  GoogleAdapter,
} from './providers';
import { loadConfig } from '../cli/commands/config';
import chalk from 'chalk';

// Re-export AVAILABLE_MODELS for external access
export { AVAILABLE_MODELS };

export interface AIClientConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface AIClientOptions {
  provider?: AIProvider;
  model?: string;
}

// Re-export types for backward compatibility
export { ChatMessage, ChatResponse as AIResponse };

export class AIClient {
  private adapter: AIProviderAdapter;

  constructor(config: AIClientConfig) {
    this.adapter = this.createAdapter(config);
  }

  private createAdapter(config: AIClientConfig): AIProviderAdapter {
    switch (config.provider) {
      case 'openai':
        return new OpenAIAdapter({
          apiKey: config.apiKey,
          model: config.model,
        });
      case 'anthropic':
        return new AnthropicAdapter({
          apiKey: config.apiKey,
          model: config.model,
        });
      case 'google':
        return new GoogleAdapter({
          apiKey: config.apiKey,
          model: config.model,
        });
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  /**
   * Get the current provider name
   */
  getProvider(): AIProvider {
    return this.adapter.getName();
  }

  /**
   * Get the current model
   */
  getModel(): string {
    return this.adapter.getModel();
  }

  /**
   * Log AI call with model info
   */
  private logAICall(method: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      chalk.dim(`[${timestamp}]`) +
        chalk.cyan(` AI Call: `) +
        chalk.yellow(`${this.adapter.getName()}/${this.adapter.getModel()}`) +
        chalk.dim(` (${method})`)
    );
  }

  /**
   * Send a chat completion request
   */
  async chat(messages: ChatMessage[], options?: { temperature?: number }): Promise<ChatResponse> {
    this.logAICall('chat');
    return this.adapter.chat(messages, options);
  }

  /**
   * Send a chat request expecting JSON response
   */
  async chatJSON<T>(messages: ChatMessage[], options?: { temperature?: number }): Promise<T> {
    const response = await this.adapter.chat(messages, {
      ...options,
      temperature: options?.temperature ?? 0.3,
      responseFormat: 'json',
    });

    try {
      return JSON.parse(response.content) as T;
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${response.content}`);
    }
  }

  /**
   * Simple prompt helper for single-turn interactions
   */
  async prompt(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    return response.content;
  }

  /**
   * JSON prompt helper for structured responses
   */
  async promptJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
    return this.chatJSON<T>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  }
}

/**
 * Get API key for a provider from environment variables
 */
function getApiKey(provider: AIProvider): string | undefined {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
    case 'google':
      return process.env.GOOGLE_API_KEY;
    default:
      return undefined;
  }
}

/**
 * Determine which provider to use based on options, config, and available keys
 */
function resolveProvider(options?: AIClientOptions): { provider: AIProvider; apiKey: string } {
  const config = loadConfig();

  // Priority: CLI option > config file > fallback to available key
  const providerPreference: AIProvider[] = options?.provider
    ? [options.provider]
    : [config.aiProvider, 'openai', 'anthropic', 'google'];

  for (const provider of providerPreference) {
    const apiKey = getApiKey(provider);
    if (apiKey) {
      return { provider, apiKey };
    }
  }

  // No API key found
  const checked = [...new Set(providerPreference)].join(', ');
  throw new Error(
    `No API key found. Set one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY.\n` +
      `Checked providers: ${checked}`
  );
}

/**
 * Create AI client from environment variables and options
 */
export function createAIClient(options?: AIClientOptions): AIClient {
  const config = loadConfig();
  const { provider, apiKey } = resolveProvider(options);

  // Model priority: CLI option > config file (if same provider) > provider default
  let model = options?.model;
  if (!model && config.aiProvider === provider) {
    model = config.aiModel;
  }
  if (!model) {
    model = DEFAULT_MODELS[provider];
  }

  // Log client initialization
  console.log(
    chalk.green('✓ AI Client initialized: ') +
      chalk.yellow.bold(`${provider}`) +
      chalk.white(' / ') +
      chalk.cyan.bold(`${model}`)
  );

  return new AIClient({
    provider,
    apiKey,
    model,
  });
}
