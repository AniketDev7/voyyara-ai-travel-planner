/**
 * Contentstack Generative AI API Integration
 * Uses Brand Kit and Voice Profile for on-brand content generation
 * 
 * Docs: https://www.contentstack.com/docs/developers/apis/generative-ai-api
 */

// Base URL for Generative AI API
// EU: https://eu-ai.contentstack.com/brand-kits
// US: https://ai.contentstack.com/brand-kits
const GENERATIVE_AI_BASE_URL = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION === 'eu' 
  ? 'https://eu-ai.contentstack.com/brand-kits'
  : 'https://ai.contentstack.com/brand-kits';

interface GenerateContentOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  useKnowledgeVault?: boolean;
}

interface GenerateContentResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Generate on-brand content using Contentstack Generative AI API
 * Docs: https://www.contentstack.com/docs/developers/apis/generative-ai-api?locale=europe
 * 
 * Endpoint: POST {base_url}/v1/genai/
 * Headers: brand_kit_uid, authtoken, authorization (management_token)
 */
export async function generateContent(
  options: GenerateContentOptions
): Promise<GenerateContentResponse> {
  const brandKitUid = process.env.CONTENTSTACK_BRAND_KIT_UID;
  const voiceProfileUid = process.env.CONTENTSTACK_VOICE_PROFILE_UID;
  // TEMP_AUTHTOKEN is a session token from Contentstack login (starts with 'blt')
  const authToken = process.env.TEMP_AUTHTOKEN || process.env.CONTENTSTACK_GENAI_AUTHTOKEN;

  if (!brandKitUid || !voiceProfileUid) {
    console.error('[GenAI] Missing required environment variables');
    console.error('[GenAI] brandKitUid:', brandKitUid ? 'Set' : 'Missing');
    console.error('[GenAI] voiceProfileUid:', voiceProfileUid ? 'Set' : 'Missing');
    return {
      success: false,
      error: 'Generative AI not configured. Missing Brand Kit or Voice Profile credentials.',
    };
  }

  if (!authToken) {
    console.error('[GenAI] Missing authtoken');
    return {
      success: false,
      error: 'Generative AI not configured. Missing TEMP_AUTHTOKEN in .env.local',
    };
  }

  // Correct endpoint: POST {base_url}/v1/genai/
  const apiUrl = `${GENERATIVE_AI_BASE_URL}/v1/genai/`;

  try {
    console.log('[GenAI] Calling:', apiUrl);
    console.log('[GenAI] brand_kit_uid:', brandKitUid);
    console.log('[GenAI] voice_profile_uid:', voiceProfileUid);
    
    // Build headers - exactly matching the working Postman request
    // Only: Content-Type, brand_kit_uid, authtoken (NO api_key or authorization)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'brand_kit_uid': brandKitUid,
    };
    
    // Add authtoken (session token - required)
    if (authToken) {
      headers['authtoken'] = authToken;
      console.log('[GenAI] Using authtoken starting with:', authToken.substring(0, 6) + '...');
    } else {
      console.error('[GenAI] No authtoken available!');
      return {
        success: false,
        error: 'Missing authtoken. Please set TEMP_AUTHTOKEN in .env.local',
      };
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt: options.prompt,
        voice_profile_uid: voiceProfileUid,
        knowledge_vault: options.useKnowledgeVault || false,
      }),
    });

    console.log('[GenAI] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[GenAI] Error response:', errorText);
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    // The API returns Server-Sent Events (SSE) stream
    // Format: data: {"id": "...", "content": "word", "complete": false, "model": "gpt-4o"}
    const responseText = await response.text();
    
    // Parse SSE stream and concatenate all content chunks
    const lines = responseText.split('\n');
    let fullContent = '';
    let tokenUsage = 0;
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.substring(6); // Remove 'data: ' prefix
          if (jsonStr.trim()) {
            const chunk = JSON.parse(jsonStr);
            if (chunk.content) {
              fullContent += chunk.content;
            }
            if (chunk.token_usage) {
              tokenUsage = chunk.token_usage;
            }
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }
    
    console.log('[GenAI] Success! Generated', fullContent.length, 'chars, tokens:', tokenUsage);
    return {
      success: true,
      content: fullContent,
    };
  } catch (error) {
    console.error('[GenAI] Request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate travel itinerary description using Voyyara voice
 */
export async function generateItineraryDescription(
  destination: string,
  duration: string,
  travelStyle: string,
  highlights: string[]
): Promise<string> {
  const prompt = `Write an engaging itinerary overview for a ${duration} ${travelStyle} trip to ${destination}. 
Highlights include: ${highlights.join(', ')}.
Make it exciting and inspiring, encouraging travelers to book this trip.
Keep it to 2-3 paragraphs.`;

  const result = await generateContent({ prompt, maxTokens: 500 });
  
  if (result.success && result.content) {
    return result.content;
  }
  
  // Fallback description
  return `Discover the magic of ${destination} on this incredible ${duration} ${travelStyle} adventure. Experience ${highlights.slice(0, 3).join(', ')} and create memories that will last a lifetime.`;
}

/**
 * Generate destination overview using Voyyara voice
 */
export async function generateDestinationOverview(
  destination: string,
  country: string
): Promise<string> {
  const prompt = `Write a captivating overview of ${destination}, ${country} for travelers.
Include what makes it special, best time to visit, and why travelers should add it to their bucket list.
Keep it to 2-3 paragraphs with an inspiring tone.`;

  const result = await generateContent({ prompt, maxTokens: 400 });
  
  if (result.success && result.content) {
    return result.content;
  }
  
  return `${destination} is a must-visit destination in ${country}, offering unforgettable experiences for every type of traveler.`;
}

/**
 * Generate hidden gem description
 */
export async function generateHiddenGemDescription(
  gemName: string,
  location: string,
  category: string
): Promise<string> {
  const prompt = `Write a short, enticing description of "${gemName}" - a hidden gem ${category} in ${location}.
Make travelers feel like they're discovering a secret that locals love.
Keep it to 1-2 short paragraphs.`;

  const result = await generateContent({ prompt, maxTokens: 200 });
  
  if (result.success && result.content) {
    return result.content;
  }
  
  return `${gemName} is one of ${location}'s best-kept secrets - a ${category} that locals love and tourists rarely find.`;
}

/**
 * Generate day activity description
 */
export async function generateActivityDescription(
  activity: string,
  location: string,
  timeOfDay: string
): Promise<string> {
  const prompt = `Write a brief, exciting description of "${activity}" in ${location} during the ${timeOfDay}.
Make it feel immersive and inspire travelers to experience it.
Keep it to 2-3 sentences.`;

  const result = await generateContent({ prompt, maxTokens: 150 });
  
  if (result.success && result.content) {
    return result.content;
  }
  
  return `Experience ${activity} in ${location} - a ${timeOfDay} activity you won't want to miss.`;
}

