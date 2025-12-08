/**
 * AI Chat API Route - Contentstack Generative AI
 * Handles conversational AI for travel planning using Voyyara Voice Profile
 */

import { SYSTEM_PROMPT } from '@/lib/ai/prompts';

// Use Edge runtime
export const runtime = 'edge';

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
  
  // Determine conversation phase based on message count
  const messageCount = messages.length;
  const hasItinerary = messages.some(m => 
    m.role === 'assistant' && 
    (m.content.includes('Day 1:') || m.content.includes('**Day 1'))
  );
  
  prompt += `\nProvide your next response as the Voyyara travel assistant.

CONVERSATION PHASE DETECTION:
- Message count: ${messageCount}
- Itinerary already generated: ${hasItinerary}

RULES BASED ON PHASE:
${messageCount <= 2 && !hasItinerary ? `
PHASE 1: Ask 2-3 quick preference questions (travel style, companions, interests) in one short message.
Don't generate itinerary yet - just ask the questions concisely.` : ''}

${messageCount > 2 && !hasItinerary ? `
PHASE 2: User has answered questions. Generate the full day-by-day itinerary NOW.
Use the format with emojis (🌅 Morning, 🌞 Afternoon, 🌙 Evening, 🍽️ Try).` : ''}

${hasItinerary ? `
PHASE 3: Itinerary exists. Help user modify or enhance it.
Suggest specific changes based on what they ask.` : ''}

IMPORTANT: At the very end, add 3 contextual suggestions:
[SUGGESTIONS]
${!hasItinerary && messageCount <= 2 ? `- Luxury experience?
- Budget-friendly option?
- Generate my itinerary!` : ''}
${!hasItinerary && messageCount > 2 ? `- Add a day trip nearby?
- Include local food tour?
- Regenerate with different pace?` : ''}
${hasItinerary ? `- Swap Day X for something else?
- Add more rest time?
- Regenerate entire itinerary?` : ''}
[/SUGGESTIONS]

Keep suggestions SHORT and actionable!`;
  
  return prompt;
}

/**
 * Parse suggestions from AI response
 */
function parseResponseAndSuggestions(text: string): { content: string; suggestions: string[] } {
  const suggestionsMatch = text.match(/\[SUGGESTIONS\]([\s\S]*?)\[\/SUGGESTIONS\]/);
  
  if (suggestionsMatch) {
    const content = text.replace(/\[SUGGESTIONS\][\s\S]*?\[\/SUGGESTIONS\]/, '').trim();
    const suggestionsText = suggestionsMatch[1];
    const suggestions = suggestionsText
      .split('\n')
      .map(s => s.replace(/^[-•]\s*/, '').trim())
      .filter(s => s.length > 0 && s.endsWith('?'));
    
    return { content, suggestions: suggestions.slice(0, 3) };
  }
  
  return { content: text, suggestions: [] };
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
    
    // Parse SSE response and collect all content
    const responseText = await response.text();
    const lines = responseText.split('\n');
    let fullContent = '';
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.substring(6).trim();
          if (jsonStr) {
            const chunk = JSON.parse(jsonStr);
            if (chunk.content) {
              fullContent += chunk.content;
            }
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
    
    // Parse content and suggestions
    const { content, suggestions } = parseResponseAndSuggestions(fullContent);
    
    console.log('[Chat] Response:', content.substring(0, 100) + '...');
    console.log('[Chat] Suggestions:', suggestions);
    
    // Return JSON response with content and suggestions
    return new Response(JSON.stringify({ content, suggestions }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('[Chat] Error:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
}
