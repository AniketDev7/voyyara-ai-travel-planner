import { Stack } from './client';
import { getVariantForPreferences } from '../personalize/edge-api';

export interface ItineraryTemplate {
  uid: string;
  title: string;
  slug: string;
  destination: any[];
  type: string;
  duration: string;
  short_description: string;
  long_description?: string;
  hero_image?: {
    uid: string;
    url: string;
  };
  hero_image_url?: string;
  thumbnail_image?: {
    uid: string;
    url: string;
  };
  price: string;
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  included_items: string[];
  day_by_day: Array<{
    day_number: string;
    day_title: string;
    day_image_url?: string;
    activities: Array<{
      time: string;
      activity_title: string;
      activity_description: string;
    }>;
  }>;
  // Variant metadata
  _variant_uid?: string;
  _variant_name?: string;
}

export interface VariantOptions {
  currency?: string;
  language?: string;
  travelStyle?: string;
}

/**
 * Fetch itinerary with Entry Variant support
 * Uses Personalize Edge API to get the correct variant UID dynamically
 */
export async function getItineraryBySlugWithVariant(
  slug: string, 
  options: VariantOptions = {}
): Promise<ItineraryTemplate | null> {
  try {
    const { currency, language, travelStyle } = options;
    
    // Get the variant UID dynamically from Personalize Edge API
    let variantUid: string | null = null;
    let variantSource: string = 'base';
    
    if (currency || language || travelStyle) {
      console.log(`Getting variant from Personalize Edge API for: currency=${currency}, language=${language}`);
      
      variantUid = await getVariantForPreferences(currency, language, travelStyle);
      
      if (variantUid) {
        variantSource = currency ? `currency:${currency}` : language ? `language:${language}` : 'personalized';
        console.log(`✅ Personalize returned variant UID: ${variantUid}`);
      } else {
        console.log('⚠️ No variant matched from Personalize, using base entry');
      }
    }

    // If we have a variant UID, fetch the variant entry
    if (variantUid) {
      const variantResult = await fetchItineraryVariant(slug, variantUid);
      if (variantResult) {
        variantResult._variant_uid = variantUid;
        variantResult._variant_name = variantSource;
        return variantResult;
      }
      
      console.log('Variant fetch failed, falling back to base entry');
    }
    
    // Fetch base entry
    const query = Stack.ContentType('itinerary_template')
      .Query()
      .where('slug', slug)
      .includeReference('destination')
      .toJSON();
    
    const result = await query.find();
    
    if (result[0] && result[0].length > 0) {
      return result[0][0] as ItineraryTemplate;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching itinerary by slug:', slug, error);
    return null;
  }
}

/**
 * Fetch itinerary variant using REST API with variant header
 */
async function fetchItineraryVariant(
  slug: string, 
  variantUid: string
): Promise<ItineraryTemplate | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
    const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENV || 'production';
    const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
    
    const baseUrl = region === 'eu' 
      ? 'https://eu-cdn.contentstack.com'
      : 'https://cdn.contentstack.io';
    
    const url = `${baseUrl}/v3/content_types/itinerary_template/entries?environment=${environment}&query={"slug":"${slug}"}&include[]=destination`;
    
    console.log(`Fetching variant entry with UID: ${variantUid}`);
    
    const response = await fetch(url, {
      headers: {
        'api_key': apiKey!,
        'access_token': deliveryToken!,
        'x-cs-variant-uid': variantUid,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.entries && data.entries.length > 0) {
        const entry = data.entries[0];
        console.log(`✅ Fetched variant entry with price: "${entry.price}"`);
        return entry as ItineraryTemplate;
      }
    } else {
      console.log(`❌ Variant fetch failed with status: ${response.status}`);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching variant:', error);
    return null;
  }
}

export async function getItinerariesByDestination(destinationTitle: string): Promise<ItineraryTemplate[]> {
  try {
    const query = Stack.ContentType('itinerary_template')
      .Query()
      .includeReference('destination')
      .toJSON();
    
    const result = await query.find();
    const allItineraries = result[0] || [];
    
    const filtered = allItineraries.filter((itin: any) => {
      const destTitle = itin.destination?.[0]?.title || itin.destination?.title;
      return destTitle === destinationTitle;
    });
    
    console.log(`Found ${filtered.length} itineraries for ${destinationTitle} out of ${allItineraries.length} total`);
    return filtered as ItineraryTemplate[];
  } catch (error: any) {
    console.error('Error fetching itineraries for', destinationTitle, ':', error);
    return [];
  }
}

export async function getItineraryBySlug(slug: string): Promise<ItineraryTemplate | null> {
  try {
    const query = Stack.ContentType('itinerary_template')
      .Query()
      .where('slug', slug)
      .includeReference('destination')
      .toJSON();
    
    const result = await query.find();
    
    if (result[0] && result[0].length > 0) {
      return result[0][0] as ItineraryTemplate;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching itinerary by slug:', slug, error);
    return null;
  }
}

export async function getAllItineraries(): Promise<ItineraryTemplate[]> {
  try {
    const query = Stack.ContentType('itinerary_template')
      .Query()
      .includeReference('destination')
      .toJSON();
    
    const result = await query.find();
    return (result[0] || []) as ItineraryTemplate[];
  } catch (error: any) {
    console.error('Error fetching all itineraries:', error);
    return [];
  }
}
