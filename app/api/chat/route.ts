/**
 * AI Chat API Route - Contentstack Generative AI
 * Handles conversational AI for travel planning using Voyyara Voice Profile
 */

import { SYSTEM_PROMPT } from '@/lib/ai/prompts';

// Use Node.js runtime for SSE parsing
export const runtime = 'nodejs';

// Environment variables
const GENERATIVE_AI_BASE_URL = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION === 'eu'
  ? 'https://eu-ai.contentstack.com/brand-kits'
  : 'https://ai.contentstack.com/brand-kits';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Build a prompt that includes conversation history
 */
function buildPromptWithHistory(messages: Message[]): string {
  // Start with system context
  let prompt = `You are Voyyara's AI travel planning assistant. ${SYSTEM_PROMPT}\n\n`;
  
  // Add conversation history
  prompt += "Conversation so far:\n";
  
  for (const msg of messages) {
    if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n`;
    }
  }
  
  // Ask for the next response
  prompt += "\nProvide your next response as the Voyyara travel assistant. Be helpful, friendly, and enthusiastic about travel. Keep your response concise and engaging.";
  
  return prompt;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get environment variables
    const brandKitUid = process.env.CONTENTSTACK_BRAND_KIT_UID;
    const voiceProfileUid = process.env.CONTENTSTACK_VOICE_PROFILE_UID;
    const authToken = process.env.TEMP_AUTHTOKEN || process.env.CONTENTSTACK_GENAI_AUTHTOKEN;
    
    if (!brandKitUid || !voiceProfileUid || !authToken) {
      console.error('[Chat] Missing Contentstack Gen AI credentials');
      return new Response('AI service not configured', { status: 500 });
    }
    
    // Build prompt with conversation history
    const prompt = buildPromptWithHistory(messages);
    
    console.log('[Chat] Calling Contentstack Gen AI...');
    
    // Call Contentstack Generative AI
    const apiUrl = `${GENERATIVE_AI_BASE_URL}/v1/genai/`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'brand_kit_uid': brandKitUid,
        'authtoken': authToken,
      },
      body: JSON.stringify({
        prompt,
        voice_profile_uid: voiceProfileUid,
        knowledge_vault: false,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat] Gen AI error:', response.status, errorText);
      return new Response('AI service error', { status: 500 });
    }
    
    // Create a TransformStream to convert SSE to text stream
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        
        const decoder = new TextDecoder();
        let buffer = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }
            
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.substring(6).trim();
                  if (jsonStr) {
                    const chunk = JSON.parse(jsonStr);
                    if (chunk.content) {
                      // Send the content chunk
                      controller.enqueue(encoder.encode(chunk.content));
                    }
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('[Chat] Stream error:', error);
          controller.error(error);
        }
      },
    });
    
    // Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('[Chat] Error:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
}
