import { NextRequest, NextResponse } from 'next/server';
import { getItineraryBySlug } from '@/lib/contentstack/itineraries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const itinerary = await getItineraryBySlug(slug);
    
    if (!itinerary) {
      return NextResponse.json(
        {
          success: false,
          error: 'Itinerary not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      itinerary,
    });
  } catch (error: any) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch itinerary',
      },
      { status: 500 }
    );
  }
}

