import { NextRequest, NextResponse } from 'next/server';
import { getItinerariesByDestination } from '@/lib/contentstack/itineraries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ destination: string }> }
) {
  try {
    const { destination } = await params;
    // destination param is the destination title (e.g., "Japan", "Vietnam")
    const itineraries = await getItinerariesByDestination(decodeURIComponent(destination));
    
    return NextResponse.json({
      success: true,
      itineraries,
    });
  } catch (error: any) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch itineraries',
        itineraries: [],
      },
      { status: 500 }
    );
  }
}

