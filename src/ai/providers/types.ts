/**
 * AI Provider Adapter Types
 * Shared interfaces for multi-provider support
 */

/** Supported AI providers */
export type AIProvider = 'openai' | 'anthropic' | 'google';

/** Chat message format */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Options for chat requests */
export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

/** Response from AI provider */
export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/** Configuration for provider adapters */
export interface ProviderConfig {
  apiKey: string;
  model?: string;
}

/** Provider adapter interface - all providers must implement this */
export interface AIProviderAdapter {
  /** Send a chat completion request */
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;

  /** Get the provider name */
  getName(): AIProvider;

  /** Get the default model for this provider */
  getDefaultModel(): string;

  /** Get the currently configured model */
  getModel(): string;
}

/** Available models per provider - reference for easy switching */
export const AVAILABLE_MODELS: Record<AIProvider, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  anthropic: ['claude-sonnet-4-5-20250929', 'claude-opus-4-5-20251101'],
  google: ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-1.5-pro'],
};

/** Default models per provider */
export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-5-20250929',
  google: 'gemini-3-flash-preview',
};
