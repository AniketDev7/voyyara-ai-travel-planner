import { Stack } from './client';

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
}

export async function getItinerariesByDestination(destinationTitle: string): Promise<ItineraryTemplate[]> {
  try {
    // Fetch all itineraries with destination reference
    const query = Stack.ContentType('itinerary_template')
      .Query()
      .includeReference('destination')
      .toJSON();
    
    const result = await query.find();
    const allItineraries = result[0] || [];
    
    // Filter by destination title (reference fields are included as full objects)
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
