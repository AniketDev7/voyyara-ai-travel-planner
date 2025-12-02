/**
 * Generate Itinerary API Route
 * Creates a complete itinerary based on user requirements
 */

import { NextResponse } from 'next/server';
import { generateItinerary, type UserRequirements } from '@/lib/ai/generate-itinerary';

export async function POST(req: Request) {
  try {
    const requirements: UserRequirements = await req.json();

    // Validate requirements
    if (!requirements.destinations || requirements.destinations.length === 0) {
      return NextResponse.json(
        { error: 'At least one destination is required' },
        { status: 400 }
      );
    }

    if (!requirements.duration || requirements.duration < 1) {
      return NextResponse.json(
        { error: 'Duration must be at least 1 day' },
        { status: 400 }
      );
    }

    // Generate itinerary
    const itinerary = await generateItinerary(requirements);

    return NextResponse.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}

