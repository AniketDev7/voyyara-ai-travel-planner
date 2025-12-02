/**
 * Destinations API Route
 * Fetch destinations from Contentstack
 */

import { NextResponse } from 'next/server';
import { getAllDestinations, searchDestinations } from '@/lib/contentstack';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    let destinations;
    
    if (search) {
      destinations = await searchDestinations(search);
    } else {
      destinations = await getAllDestinations(limit);
    }

    return NextResponse.json({
      success: true,
      destinations,
      count: destinations.length,
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

