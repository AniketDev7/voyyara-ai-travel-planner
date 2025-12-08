import { NextResponse } from 'next/server';
import { 
  generateContent, 
  generateItineraryDescription,
  generateDestinationOverview 
} from '@/lib/contentstack/generative-ai';

/**
 * POST /api/generate-content
 * Generate on-brand content using Contentstack Generative AI
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, prompt, ...params } = body;

    let result;

    switch (type) {
      case 'itinerary':
        const { destination, duration, travelStyle, highlights } = params;
        result = await generateItineraryDescription(
          destination,
          duration,
          travelStyle,
          highlights || []
        );
        break;

      case 'destination':
        const { destinationName, country } = params;
        result = await generateDestinationOverview(destinationName, country);
        break;

      case 'custom':
      default:
        if (!prompt) {
          return NextResponse.json(
            { error: 'Prompt is required for custom content generation' },
            { status: 400 }
          );
        }
        const response = await generateContent({ prompt });
        result = response.success ? response.content : response.error;
        break;
    }

    return NextResponse.json({
      success: true,
      content: result,
    });

  } catch (error) {
    console.error('[Generate Content] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-content
 * Test endpoint to verify Generative AI configuration
 */
export async function GET() {
  const brandKitUid = process.env.CONTENTSTACK_BRAND_KIT_UID;
  const voiceProfileUid = process.env.CONTENTSTACK_VOICE_PROFILE_UID;
  const hasAuthToken = !!process.env.CONTENTSTACK_MANAGEMENT_TOKEN;

  return NextResponse.json({
    configured: !!(brandKitUid && voiceProfileUid && hasAuthToken),
    brandKit: brandKitUid ? `${brandKitUid.slice(0, 8)}...` : 'Not set',
    voiceProfile: voiceProfileUid ? `${voiceProfileUid.slice(0, 8)}...` : 'Not set',
    authToken: hasAuthToken ? 'Set' : 'Not set',
  });
}

