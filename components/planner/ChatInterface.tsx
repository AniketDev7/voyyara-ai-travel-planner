'use client';

/**
 * Chat Interface Switcher
 * 
 * Switches between OpenAI and Contentstack GenAI based on environment variable:
 * NEXT_PUBLIC_AI_PROVIDER=openai | genai
 * 
 * Default: genai (Contentstack Generative AI)
 */

import { ChatInterfaceGenAI } from './ChatInterfaceGenAI';
import { ChatInterfaceOpenAI } from './ChatInterfaceOpenAI';

export function ChatInterface() {
  // Get AI provider from environment variable
  // Default to 'genai' (Contentstack Generative AI)
  const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'genai';

  if (aiProvider === 'openai') {
    return <ChatInterfaceOpenAI />;
  }

  return <ChatInterfaceGenAI />;
}
