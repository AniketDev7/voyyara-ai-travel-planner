/**
 * Destinations API Route
 * Fetch destinations from Contentstack
 */

import { NextResponse } from 'next/server';
import { getAllDestinations, searchDestinations } from '@/lib/contentstack';

// Define display order for destinations
const DESTINATION_ORDER: Record<string, number> = {
  'Japan': 1,
  'Thailand': 2,
  'Vietnam': 3,
  'South Korea': 4,
  'Singapore': 5,
  'Hong Kong': 6,
  'China': 7,
  'Macau': 8,
  'Indonesia': 9, // Bali
  'Malaysia': 10,
  'Philippines': 11,
  'Dubai': 12,
  'Cambodia': 13,
  'Laos': 14,
};

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

    // Sort destinations by predefined order
    destinations.sort((a: any, b: any) => {
      const orderA = DESTINATION_ORDER[a.title] || 999;
      const orderB = DESTINATION_ORDER[b.title] || 999;
      return orderA - orderB;
    });

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

