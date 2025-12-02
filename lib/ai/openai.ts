/**
 * OpenAI Client and Configuration
 */

import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Default model configuration
export const DEFAULT_MODEL = (process.env.OPENAI_MODEL || 'gpt-4-turbo') as 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo';

// Validate OpenAI configuration
export const validateOpenAIConfig = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  return true;
};

// Log configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('OpenAI Configuration:');
  console.log('   Model:', DEFAULT_MODEL);
  console.log('   API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Missing');
}

