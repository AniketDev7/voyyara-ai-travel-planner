/**
 * Maps user quiz preferences to Contentstack Personalize attributes
 * This bridges the gap between our quiz and the Personalize variant matching system
 */

import { setPersonalizeAttribute, getPersonalizeAttributes } from './tracking';

// Quiz preference keys
export type PreferenceKey = 
  | 'travel_style'
  | 'traveler_type'
  | 'interests'
  | 'pace'
  | 'duration';

// Personalize attribute keys (as defined in Contentstack Personalize project)
// These match the keys in docs/Voyyara-AI/main/personalize/attributes/attributes.json
export type PersonalizeAttributeKey =
  | 'price_type'        // Maps from quiz travel_style (luxury, mid_range, budget, backpacker)
  | 'traveler_type'     // Maps from quiz traveler_type (solo, couple, family, friends)
  | 'user_interests'    // Maps from quiz interests (comma-separated)
  | 'travel_pace'       // Maps from quiz pace (relaxed, moderate, packed)
  | 'trip_duration'     // Maps from quiz duration (weekend, week, two_weeks, extended)
  | 'user_currency'     // From LocalizationSwitcher
  | 'user_language'     // From LocalizationSwitcher
  | 'travel_type'       // Existing attribute for travel experience type
  | 'travel_destination'; // Existing attribute for destination region

// Map quiz keys to Personalize attribute keys (matches attributes.json)
const QUIZ_TO_PERSONALIZE_MAP: Record<string, PersonalizeAttributeKey> = {
  'travel_style': 'price_type',       // luxury, mid_range, budget, backpacker
  'traveler_type': 'traveler_type',   // solo, couple, family, friends
  'interests': 'user_interests',       // comma-separated: culture, food, adventure, etc.
  'pace': 'travel_pace',               // relaxed, moderate, packed
  'duration': 'trip_duration',         // weekend, week, two_weeks, extended
};

/**
 * Map quiz preferences to Personalize attributes
 * Call this after quiz completion or when preferences change
 */
export function syncPreferencesToPersonalize(preferences: Record<string, string | string[]>) {
  // Map each preference to a Personalize attribute using the correct keys
  Object.entries(preferences).forEach(([key, value]) => {
    const attrKey = QUIZ_TO_PERSONALIZE_MAP[key] || key;
    const attrValue = Array.isArray(value) ? value.join(',') : value;
    setPersonalizeAttribute(attrKey, attrValue);
  });
  
  console.log('[Personalize] Synced preferences:', preferences);
}

/**
 * Get user attributes for variant matching
 * Returns attributes in the format expected by the Personalize Edge API
 */
export function getUserAttributesForMatching(): Record<string, string> {
  const attrs = getPersonalizeAttributes();
  const result: Record<string, string> = {};
  
  // Only include non-empty values
  Object.entries(attrs).forEach(([key, value]) => {
    if (value) {
      result[key] = value;
    }
  });
  
  return result;
}

/**
 * Build audience matching criteria based on user preferences
 * This can be used for client-side filtering or API requests
 */
export function getAudienceMatchCriteria(preferences: Record<string, string | string[]>) {
  const criteria: Record<string, any> = {};
  
  // Travel style - direct match
  if (preferences.travel_style) {
    criteria.travel_style = preferences.travel_style;
  }
  
  // Traveler type - direct match
  if (preferences.traveler_type) {
    criteria.traveler_type = preferences.traveler_type;
  }
  
  // Interests - array match (any of)
  if (preferences.interests) {
    criteria.interests = Array.isArray(preferences.interests) 
      ? preferences.interests 
      : [preferences.interests];
  }
  
  // Pace - direct match
  if (preferences.pace) {
    criteria.pace = preferences.pace;
  }
  
  // Duration - map to trip type
  if (preferences.duration) {
    criteria.duration = preferences.duration;
  }
  
  return criteria;
}

/**
 * Score an itinerary against user preferences
 * Higher score = better match
 */
export function scoreItineraryMatch(
  itinerary: {
    travel_style?: string;
    traveler_type?: string;
    type?: string;
    duration?: { days?: number } | string;
  },
  preferences: Record<string, string | string[]>
): number {
  let score = 0;
  
  // Travel style match (weight: 30)
  if (preferences.travel_style && itinerary.travel_style === preferences.travel_style) {
    score += 30;
  }
  
  // Traveler type match (weight: 25)
  if (preferences.traveler_type && itinerary.traveler_type === preferences.traveler_type) {
    score += 25;
  }
  
  // Trip type matches interests (weight: 25)
  if (preferences.interests && itinerary.type) {
    const interests = Array.isArray(preferences.interests) 
      ? preferences.interests 
      : [preferences.interests];
    if (interests.includes(itinerary.type)) {
      score += 25;
    }
  }
  
  // Duration match (weight: 20)
  if (preferences.duration && itinerary.duration) {
    const itinDays = typeof itinerary.duration === 'object' 
      ? itinerary.duration.days 
      : parseInt(itinerary.duration);
    
    const durationMatch = {
      'weekend': [2, 3, 4],
      'week': [5, 6, 7, 8],
      'two_weeks': [9, 10, 11, 12, 13, 14],
      'extended': [15, 16, 17, 18, 19, 20, 21, 30, 60, 90],
    };
    
    const preferredDays = durationMatch[preferences.duration as keyof typeof durationMatch] || [];
    if (itinDays && preferredDays.includes(itinDays)) {
      score += 20;
    }
  }
  
  return score;
}

/**
 * Get personalized itinerary recommendations
 * Sorts itineraries by match score
 */
export function getPersonalizedRecommendations<T extends {
  travel_style?: string;
  traveler_type?: string;
  type?: string;
  duration?: { days?: number } | string;
}>(
  itineraries: T[],
  preferences: Record<string, string | string[]>
): T[] {
  // Score and sort
  const scored = itineraries.map(itin => ({
    itinerary: itin,
    score: scoreItineraryMatch(itin, preferences),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored.map(s => s.itinerary);
}

/**
 * Personalize Attribute Definitions
 * Note: UIDs are fetched dynamically from Personalize API at runtime
 * These definitions describe the attribute schema for reference
 */
export const PERSONALIZE_ATTRIBUTE_KEYS = {
  PRICE_TYPE: 'price_type',           // Budget preference (luxury, mid_range, budget, backpacker)
  TRAVELER_TYPE: 'traveler_type',     // Who travels (solo, couple, family, friends)
  USER_INTERESTS: 'user_interests',   // Comma-separated interests
  TRAVEL_PACE: 'travel_pace',         // Activity level (relaxed, moderate, packed)
  TRIP_DURATION: 'trip_duration',     // Trip length (weekend, week, two_weeks, extended)
  USER_CURRENCY: 'user_currency',     // Preferred currency
  USER_LANGUAGE: 'user_language',     // Preferred language
  TRAVEL_DESTINATION: 'travel_destination', // Destination region
  TRAVEL_TYPE: 'travel_type',         // Experience type
} as const;

/**
 * Possible values for each attribute
 */
export const ATTRIBUTE_VALUES = {
  price_type: ['luxury', 'mid_range', 'budget', 'backpacker'],
  traveler_type: ['solo', 'couple', 'family', 'friends'],
  user_interests: ['culture', 'food', 'adventure', 'nature', 'relaxation', 'photography', 'nightlife', 'shopping'],
  travel_pace: ['relaxed', 'moderate', 'packed'],
  trip_duration: ['weekend', 'week', 'two_weeks', 'extended'],
  user_currency: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'SGD', 'THB', 'VND'],
  user_language: ['en', 'hi', 'ja', 'ko', 'th', 'vi', 'zh'],
  travel_destination: ['ASIA', 'EUROPE', 'AMERICAS', 'AFRICA', 'OCEANIA'],
  travel_type: ['cultural', 'adventure', 'food', 'nature', 'relaxation', 'urban'],
} as const;

/**
 * Audience names for reference
 * Actual UIDs are managed in Contentstack Personalize dashboard
 */
export const AUDIENCE_NAMES = {
  // Travel Style
  LUXURY_TRAVELERS: 'Luxury Travelers',
  BUDGET_TRAVELERS: 'Budget Travelers',
  
  // Traveler Type
  SOLO_TRAVELERS: 'Solo Travelers',
  COUPLES: 'Couples',
  FAMILY_TRAVELERS: 'Family Travelers',
  FRIEND_GROUPS: 'Friend Groups',
  
  // Interests
  CULTURE_ENTHUSIASTS: 'Culture Enthusiasts',
  FOOD_ENTHUSIASTS: 'Food Enthusiasts',
  ADVENTURE_SEEKERS: 'Adventure Seekers',
  NATURE_LOVERS: 'Nature Lovers',
  
  // Pace
  RELAXED_PACE: 'Relaxed Pace Travelers',
  PACKED_PACE: 'Action Packed Travelers',
  
  // Duration
  WEEKEND_TRIPPERS: 'Weekend Trippers',
  EXTENDED_TRAVELERS: 'Extended Trip Travelers',
} as const;

