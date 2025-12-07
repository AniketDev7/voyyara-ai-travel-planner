import { NextRequest, NextResponse } from 'next/server';
import { getItineraryBySlug, getItineraryWithPersonalization } from '@/lib/contentstack/itineraries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get travel style preference from query params (sent based on quiz)
    const searchParams = request.nextUrl.searchParams;
    const travelStyle = searchParams.get('style'); // 'luxury', 'mid_range', 'budget', 'backpacker'
    
    console.log(`Fetching itinerary: ${slug}, style preference: ${travelStyle || 'none'}`);
    
    // Try to fetch with variant based on travel style
    if (travelStyle) {
      const result = await getItineraryWithPersonalization(slug, travelStyle);
      
      if (result) {
        return NextResponse.json({
          success: true,
          itinerary: result.itinerary,
          personalization: {
            travelStyle,
            variantApplied: result.variantApplied,
            variantType: result.variantType,
          }
        });
      }
    }
    
    // Fallback to base itinerary
    const itinerary = await getItineraryBySlug(slug);
    
    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      itinerary,
      personalization: {
        travelStyle: travelStyle || 'default',
        variantApplied: false,
        variantType: null,
      }
    });
    
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}
