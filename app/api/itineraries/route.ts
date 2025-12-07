import { NextResponse } from 'next/server';
import { getAllItineraries } from '@/lib/contentstack/itineraries';

export async function GET() {
  try {
    const itineraries = await getAllItineraries();
    
    return NextResponse.json({
      success: true,
      itineraries,
      count: itineraries.length,
    });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

