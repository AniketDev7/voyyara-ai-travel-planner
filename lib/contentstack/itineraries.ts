/**
 * Contentstack queries for Itineraries
 * Using TypeScript Delivery SDK
 */

import { Stack, QueryOperation } from './client';
import { getVariantForPreferences } from '../personalize/edge-api';

// V1 Itinerary Template (basic structure)
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
    description?: string;
  }>;
  included_items: string[];
  day_by_day: Array<{
    day_number: string;
    day_title: string;
    day_image_url?: string;
    day_image?: { url: string };
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

// V2 Itinerary Template (enhanced with rich content)
export interface ItineraryTemplateV2 extends ItineraryTemplate {
  // Overview & Details (JSON RTE)
  overview?: any;
  detailed_description?: any;
  
  // Enhanced metadata
  difficulty_level?: string;
  best_season?: string;
  group_size?: string;
  
  // What's included/not included
  whats_included?: string[];
  not_included?: string[];
  
  // Enhanced day-by-day (detailed_itinerary)
  detailed_itinerary?: Array<{
    day_number: string;
    day_title: string;
    day_theme?: string;
    day_overview?: any;
    day_image?: { url: string };
    day_image_url?: string;
    activities?: Array<{
      time: string;
      activity_title: string;
      activity_description: string;
      activity_type?: string;
      duration_minutes?: number;
      cost_estimate?: string;
      booking_required?: boolean;
      booking_url?: string;
      pro_tip?: string;
    }>;
    meals?: Array<{
      meal_type: string;
      venue_name: string;
      cuisine_type: string;
      price_range: string;
      description: string;
      pro_tip?: string;
    }>;
    accommodation?: {
      name: string;
      type: string;
      area: string;
      price_range: string;
      description: string;
    };
    pro_tips?: string[];
    walking_distance?: string;
    budget_summary?: string;
  }>;
  
  // Hidden Gems
  hidden_gems?: Array<{
    name: string;
    category: string;
    description: string;
    why_special: string;
    best_time: string;
    local_tip: string;
  }>;
  
  // Dining Guide
  dining_guide?: {
    restaurants?: Array<{
      name: string;
      cuisine: string;
      price_range: string;
      specialty_dish: string;
      description: string;
      reservation_tip: string;
      address?: string;
    }>;
    street_food?: Array<{
      name: string;
      description: string;
      where_to_find: string;
    }>;
    food_etiquette?: string[];
  };
  
  // Neighborhoods
  neighborhoods?: Array<{
    name: string;
    vibe: string;
    best_for: string;
    must_see: string;
    local_experience: string;
  }>;
  
  // Seasonal Events
  seasonal_events?: Array<{
    event_name: string;
    date_range: string;
    description: string;
    insider_tip: string;
  }>;
  
  // Practical Info
  practical_info?: {
    transportation?: Array<{
      mode: string;
      description: string;
      cost_estimate: string;
    }>;
    money_tips?: string[];
    safety_tips?: string[];
    packing_essentials?: string[];
    useful_phrases?: Array<{
      phrase: string;
      meaning: string;
      pronunciation: string;
    }>;
  };
}

export interface VariantOptions {
  currency?: string;
  language?: string;
  travelStyle?: string;
}

/**
 * Fetch itinerary with Entry Variant support
 * Tries V2 (rich content) first, then falls back to V1
 * Uses Personalize Edge API to get the correct variant UID dynamically
 */
export async function getItineraryBySlugWithVariant(
  slug: string, 
  options: VariantOptions = {}
): Promise<ItineraryTemplateV2 | null> {
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

    // Use only V2 content type (itinerary_template_v2)
    const contentType = 'itinerary_template_v2';
    
    // If we have a variant UID, try fetching the variant entry first
    if (variantUid) {
      const variantResult = await fetchItineraryVariant(slug, variantUid, contentType);
      if (variantResult) {
        variantResult._variant_uid = variantUid;
        variantResult._variant_name = variantSource;
        console.log(`✅ Found ${contentType} variant for slug: ${slug}`);
        return normalizeItinerary(variantResult);
      }
    }
    
    // Fetch base entry using TypeScript SDK
    try {
      const result = await Stack.contentType(contentType)
        .entry()
        .includeReference('destination')
        .query()
        .where('slug', QueryOperation.EQUALS, slug)
        .find<ItineraryTemplateV2>();
      
      if (result.entries && result.entries.length > 0) {
        console.log(`✅ Found ${contentType} entry for slug: ${slug}`);
        return normalizeItinerary(result.entries[0] as any);
      }
    } catch (err) {
      console.error(`Error fetching ${contentType}:`, err);
    }
    
    console.log(`❌ No itinerary found for slug: ${slug}`);
    return null;
  } catch (error: any) {
    console.error('Error fetching itinerary by slug:', slug, error);
    return null;
  }
}

/**
 * Normalize itinerary data to ensure consistent structure
 * Handles V2 content type fields
 */
function normalizeItinerary(entry: any): ItineraryTemplateV2 {
  // Map V2 detailed_itinerary to day_by_day if present
  if (entry.detailed_itinerary && !entry.day_by_day) {
    entry.day_by_day = entry.detailed_itinerary;
  }
  
  // Normalize duration - V2 uses group with days/nights/display_text
  let duration = entry.duration;
  if (typeof entry.duration === 'object' && entry.duration?.display_text) {
    // Keep the display_text as the main duration string
    duration = entry.duration.display_text;
  } else if (typeof entry.duration === 'object' && entry.duration?.days) {
    // Format from days/nights if no display_text
    duration = entry.duration.nights 
      ? `${entry.duration.nights} Nights / ${entry.duration.days} Days`
      : `${entry.duration.days} Days`;
  }
  
  // Normalize price - V2 uses pricing group with display_price
  let price = entry.price;
  if (entry.pricing?.display_price) {
    price = entry.pricing.display_price;
  } else if (entry.pricing?.price_display) {
    price = entry.pricing.price_display;
  } else if (entry.pricing?.base_price) {
    price = `From $${entry.pricing.base_price}`;
  }
  
  // Normalize highlights - V2 uses highlight_title/highlight_description
  const highlights = (entry.highlights || []).map((h: any) => ({
    icon: h.icon,
    title: h.title || h.highlight_title,
    description: h.description || h.highlight_description,
  }));
  
  // Normalize whats_included - V2 uses array of objects with 'item' field
  let included_items = entry.included_items || [];
  if (entry.whats_included && Array.isArray(entry.whats_included)) {
    if (typeof entry.whats_included[0] === 'object') {
      // V2 format - extract item field
      included_items = entry.whats_included.map((inc: any) => 
        inc.item ? `${inc.icon || ''} ${inc.item}${inc.details ? ` - ${inc.details}` : ''}`.trim() : ''
      ).filter(Boolean);
    } else {
      // V1 format - already strings
      included_items = entry.whats_included;
    }
  }
  
  // Normalize hidden_gems - V2 uses different field names
  const hidden_gems = (entry.hidden_gems || []).map((gem: any) => ({
    name: gem.name,
    category: gem.category || gem.gem_type,
    description: gem.description || '',
    why_special: gem.why_special || '',
    best_time: gem.best_time,
    local_tip: gem.local_tip || '',
  }));
  
  // Normalize neighborhoods
  const neighborhoods = (entry.neighborhoods || []).map((n: any) => ({
    name: n.name,
    vibe: n.vibe,
    best_for: Array.isArray(n.best_for) ? n.best_for.join(', ') : n.best_for,
    must_see: n.must_see || '',
    local_experience: n.local_experience || '',
  }));
  
  // Normalize dining_guide - V2 uses array, frontend expects object
  let dining_guide = entry.dining_guide;
  if (Array.isArray(entry.dining_guide)) {
    dining_guide = {
      restaurants: entry.dining_guide.map((r: any) => ({
        name: r.name,
        cuisine: r.cuisine,
        price_range: r.price_range,
        specialty_dish: r.must_try?.[0] || '',
        description: r.why_we_love || '',
        reservation_tip: r.reservation_required ? 'Reservation recommended' : 'No reservation needed',
        address: r.restaurant_location || r.location,
      })),
    };
  }
  
  // Normalize seasonal_events - V2 uses different field names
  const seasonal_events = (entry.seasonal_events || []).map((e: any) => ({
    event_name: e.name || e.event_name,
    date_range: e.date_period || e.date_range,
    description: e.event_description || e.description,
    insider_tip: e.dont_miss || e.insider_tip,
  }));
  
  // Normalize day_by_day
  const day_by_day = (entry.day_by_day || entry.detailed_itinerary || []).map((day: any) => ({
    ...day,
    day_number: String(day.day_number),
    day_image_url: day.day_image?.url || day.day_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    // Ensure activities exist
    activities: (day.activities || []).map((act: any) => ({
      time: act.time || act.time_slot,
      activity_title: act.activity_title || act.title,
      activity_description: act.activity_description || extractTextFromJsonRte(act.description),
      activity_type: act.activity_type,
      duration_minutes: act.duration_minutes,
      cost_estimate: act.cost_estimate || act.entry_fee,
      booking_required: act.booking_required,
      booking_url: act.booking_url || act.booking_link,
      pro_tip: act.pro_tip || (act.pro_tips ? act.pro_tips[0] : ''),
    })),
  }));

  // Normalize hero_image and thumbnail_image
  const hero_image = entry.hero_image?.url 
    ? entry.hero_image 
    : (entry.hero_image ? { uid: entry.hero_image, url: null } : null);
  
  const thumbnail_image = entry.thumbnail?.url 
    ? entry.thumbnail 
    : entry.thumbnail_image?.url 
      ? entry.thumbnail_image 
      : (entry.thumbnail ? { uid: entry.thumbnail, url: null } : null);

  // Ensure V2 fields are available even for V1 entries
  return {
    ...entry,
    duration,
    price,
    highlights,
    included_items,
    hidden_gems,
    neighborhoods,
    dining_guide,
    seasonal_events,
    day_by_day,
    // Map hero_image and thumbnail_image
    hero_image,
    thumbnail_image,
    // Map overview to short_description if needed
    short_description: entry.short_description || extractTextFromJsonRte(entry.overview),
    // Map whats_not_included to not_included
    not_included: entry.not_included || entry.whats_not_included || [],
  };
}

/**
 * Extract plain text from JSON RTE for fallback
 */
function extractTextFromJsonRte(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  
  function extract(node: any): string {
    if (node.text) return node.text;
    if (node.content) {
      return node.content.map(extract).join(' ');
    }
    return '';
  }
  
  if (content.type === 'doc' && content.content) {
    return content.content.map(extract).join(' ').trim();
  }
  
  return '';
}

/**
 * Fetch itinerary variant using REST API with variant header
 * Supports both V1 (itinerary_template) and V2 (itinerary_template_v2) content types
 * NOTE: This uses direct REST API calls because the SDK doesn't support variant headers yet
 */
async function fetchItineraryVariant(
  slug: string, 
  variantUid: string,
  contentType: string = 'itinerary_template'
): Promise<ItineraryTemplateV2 | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
    const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENV || 'production';
    const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
    
    const baseUrl = region === 'eu' 
      ? 'https://eu-cdn.contentstack.com'
      : 'https://cdn.contentstack.io';
    
    const url = `${baseUrl}/v3/content_types/${contentType}/entries?environment=${environment}&query={"slug":"${slug}"}&include[]=destination`;
    
    console.log(`Fetching ${contentType} variant with UID: ${variantUid}`);
    
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
        console.log(`✅ Fetched ${contentType} variant with price: "${entry.price}"`);
        return entry as ItineraryTemplateV2;
      }
    } else {
      console.log(`❌ ${contentType} variant fetch failed with status: ${response.status}`);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${contentType} variant:`, error);
    return null;
  }
}

/**
 * Get all itineraries for a specific destination
 * Uses itinerary_template_v2 content type only
 */
export async function getItinerariesByDestination(destinationTitle: string): Promise<ItineraryTemplateV2[]> {
  try {
    const contentType = 'itinerary_template_v2';
    
    const result = await Stack.contentType(contentType)
      .entry()
      .includeReference('destination')
      .query()
      .find<ItineraryTemplateV2>();
    
    const entries = result.entries || [];
    
    const filtered = entries.filter((itin: any) => {
      const destTitle = itin.destination?.[0]?.title || itin.destination?.title;
      return destTitle === destinationTitle;
    }).map((entry: any) => normalizeItinerary(entry));
    
    console.log(`Found ${filtered.length} itineraries for ${destinationTitle}`);
    return filtered;
  } catch (error: any) {
    console.error('Error fetching itineraries for', destinationTitle, ':', error);
    return [];
  }
}

/**
 * Get itinerary by slug (without variants)
 * Uses itinerary_template_v2 content type only
 */
export async function getItineraryBySlug(slug: string): Promise<ItineraryTemplateV2 | null> {
  try {
    const contentType = 'itinerary_template_v2';
    
    const result = await Stack.contentType(contentType)
      .entry()
      .includeReference('destination')
      .query()
      .where('slug', QueryOperation.EQUALS, slug)
      .find<ItineraryTemplateV2>();
    
    if (result.entries && result.entries.length > 0) {
      console.log(`Found ${contentType} entry for slug: ${slug}`);
      return normalizeItinerary(result.entries[0] as any);
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching itinerary by slug:', slug, error);
    return null;
  }
}

/**
 * Get all itineraries from itinerary_template_v2 content type
 */
export async function getAllItineraries(): Promise<ItineraryTemplateV2[]> {
  try {
    const contentType = 'itinerary_template_v2';
    
    const result = await Stack.contentType(contentType)
      .entry()
      .includeReference('destination')
      .query()
      .find<ItineraryTemplateV2>();
    
    const entries = (result.entries || []).map((entry: any) => normalizeItinerary(entry));
    
    return entries;
  } catch (error: any) {
    console.error('Error fetching all itineraries:', error);
    return [];
  }
}

// ============================================
// PERSONALIZATION - Dynamic Variant Fetching
// Uses Personalize Edge API to get matched variants
// Docs: https://www.contentstack.com/docs/developers/apis/personalize-edge-api
// ============================================

/**
 * Map quiz travel_style values to Personalize attribute values
 * (price_type attribute in Contentstack Personalize)
 */
const QUIZ_TO_PERSONALIZE_STYLE: Record<string, string> = {
  'luxury': 'luxury',
  'mid_range': 'mid_range', 
  'budget': 'budget',
  'backpacker': 'budget', // Maps to budget audience
};

/**
 * Get variant UID from Personalize Edge API based on user attributes
 * This dynamically fetches the matched variant instead of hardcoding UIDs
 */
async function getVariantFromEdgeAPI(travelStyle: string): Promise<string | null> {
  const projectUid = process.env.PERSONALIZE_PROJECT_UID || process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID;
  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'eu';
  
  if (!projectUid) {
    console.log('[Personalize] Project UID not configured, skipping variant fetch');
    return null;
  }
  
  const edgeApiUrl = region === 'eu'
    ? 'https://eu-personalize-edge.contentstack.com'
    : 'https://personalize-edge.contentstack.com';
  
  try {
    // Map travel style to Personalize attribute value
    const priceType = QUIZ_TO_PERSONALIZE_STYLE[travelStyle] || travelStyle;
    
    const requestBody = {
      attributes: {
        price_type: priceType, // This matches the attribute key in Personalize
      },
    };
    
    console.log(`[Personalize Edge API] Requesting variant for price_type: ${priceType}`);
    
    const response = await fetch(`${edgeApiUrl}/v2/personalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-project-uid': projectUid,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[Personalize Edge API] Response:', JSON.stringify(data, null, 2));
      
      // Extract variant UID from matched experiences
      if (data.edges && data.edges.length > 0) {
        // Find the Travel Style Personalization experience
        const travelStyleExperience = data.edges.find((edge: any) => 
          edge.experience_name?.includes('Travel Style') || 
          edge.experience_short_uid === '2' // Travel Style Personalization shortUid
        );
        
        if (travelStyleExperience?.variant_uid) {
          console.log(`[Personalize] Matched variant: ${travelStyleExperience.variant_uid}`);
          return travelStyleExperience.variant_uid;
        }
        
        // Fallback: return first matched variant
        const firstMatch = data.edges[0];
        if (firstMatch?.variant_uid) {
          console.log(`[Personalize] Using first matched variant: ${firstMatch.variant_uid}`);
          return firstMatch.variant_uid;
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`[Personalize Edge API] Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('[Personalize Edge API] Error:', error);
  }
  
  return null;
}

/**
 * Get itinerary with personalized variant based on travel style
 * Uses Personalize Edge API to dynamically fetch the correct variant
 */
export async function getItineraryWithPersonalization(
  slug: string, 
  travelStyle: string
): Promise<{ itinerary: ItineraryTemplateV2; variantApplied: boolean; variantType: string | null } | null> {
  try {
    // Get variant UID dynamically from Personalize Edge API
    const variantUid = await getVariantFromEdgeAPI(travelStyle);
    
    if (variantUid) {
      console.log(`[Personalization] Fetching variant: ${variantUid} for style: ${travelStyle}`);
      
      // Try fetching with variant header
      const variantItinerary = await fetchItineraryWithVariant(slug, variantUid);
      
      if (variantItinerary) {
        console.log(`✅ Variant applied: ${travelStyle}`);
        return {
          itinerary: variantItinerary,
          variantApplied: true,
          variantType: travelStyle,
        };
      }
    }
    
    // Fallback to base entry
    const baseItinerary = await getItineraryBySlug(slug);
    if (baseItinerary) {
      return {
        itinerary: baseItinerary,
        variantApplied: false,
        variantType: null,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching personalized itinerary:', error);
    return null;
  }
}

/**
 * Fetch itinerary entry with specific variant UID
 * Uses itinerary_template_v2 content type only
 * NOTE: This uses direct REST API calls because the SDK doesn't support variant headers yet
 */
async function fetchItineraryWithVariant(slug: string, variantUid: string): Promise<ItineraryTemplateV2 | null> {
  const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
  const ENV = process.env.NEXT_PUBLIC_CONTENTSTACK_ENV || 'production';
  const REGION = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'eu';
  
  const baseUrl = REGION === 'eu'
    ? 'https://eu-cdn.contentstack.com/v3'
    : 'https://cdn.contentstack.io/v3';
  
  const contentType = 'itinerary_template_v2';
  
  try {
    const url = `${baseUrl}/content_types/${contentType}/entries?environment=${ENV}&query={"slug":"${slug}"}`;
    
    const response = await fetch(url, {
      headers: {
        'api_key': API_KEY!,
        'access_token': DELIVERY_TOKEN!,
        'x-cs-variant-uid': variantUid,
      },
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.entries && data.entries.length > 0) {
        const entry = data.entries[0];
        
        // Return the entry with variant metadata
        const normalized = normalizeItinerary(entry);
        normalized._variant_uid = variantUid;
        normalized._variant_name = `Variant: ${variantUid}`;
        
        return normalized;
      }
    }
  } catch (error) {
    console.error('Error fetching variant:', error);
  }
  
  return null;
}
