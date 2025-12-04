import { NextRequest, NextResponse } from 'next/server';
import { getItineraryBySlugWithVariant, getItineraryBySlug } from '@/lib/contentstack/itineraries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get user preferences from query params (sent by frontend based on Personalize attributes)
    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get('currency') || 'USD';
    const language = searchParams.get('language') || 'en';
    
    console.log(`Fetching itinerary: ${slug} with currency: ${currency}, language: ${language}`);
    
    // Try to fetch with Entry Variant first
    let itinerary = await getItineraryBySlugWithVariant(slug, { currency, language });
    let variantApplied = false;
    
    if (itinerary?._variant_uid) {
      variantApplied = true;
      console.log(`Variant applied: ${itinerary._variant_name}`);
    } else {
      // Fallback to base entry
      itinerary = await getItineraryBySlug(slug);
    }
    
    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }
    
    // If no variant was applied, do client-side price conversion as fallback
    let finalPrice = itinerary.price;
    
    if (!variantApplied && currency !== 'USD') {
      // Currency conversion rates (fallback when no CMS variant exists)
      const conversionRates: Record<string, { rate: number; symbol: string }> = {
        USD: { rate: 1, symbol: '$' },
        EUR: { rate: 0.92, symbol: '€' },
        GBP: { rate: 0.79, symbol: '£' },
        INR: { rate: 83.12, symbol: '₹' },
        JPY: { rate: 149.50, symbol: '¥' },
        SGD: { rate: 1.34, symbol: 'S$' },
        AUD: { rate: 1.53, symbol: 'A$' },
        THB: { rate: 35.50, symbol: '฿' },
        VND: { rate: 24500, symbol: '₫' },
        KRW: { rate: 1320, symbol: '₩' },
      };
      
      const conversion = conversionRates[currency] || conversionRates.USD;
      
      // Extract numeric price and convert
      const priceMatch = itinerary.price?.match(/[\d,]+/);
      if (priceMatch) {
        const basePrice = parseInt(priceMatch[0].replace(/,/g, ''), 10);
        const newPrice = Math.round(basePrice * conversion.rate);
        finalPrice = `${conversion.symbol}${newPrice.toLocaleString()}`;
      }
    }
    
    // Return itinerary with localized price
    return NextResponse.json({
      success: true,
      itinerary: {
        ...itinerary,
        price: finalPrice,
        currency: currency,
        language: language,
      },
      personalization: {
        currency,
        language,
        variantApplied,
        variantUid: itinerary._variant_uid || null,
        variantName: itinerary._variant_name || null,
      }
    });
    
  } catch (error) {
    console.error('Error fetching itinerary with variants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}
