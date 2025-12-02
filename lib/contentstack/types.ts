/**
 * TypeScript types for Contentstack content types
 * Based on the content model defined in the implementation plan
 */

// Base Contentstack entry interface
export interface ContentstackEntry {
  uid: string;
  title: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  locale: string;
  _version: number;
}

// Destination content type
export interface Destination extends ContentstackEntry {
  slug: string;
  country: string;
  region: string;
  description: string;
  short_description: string;
  featured_image: ContentstackAsset;
  gallery?: ContentstackAsset[];
  hero_video?: ContentstackAsset;
  best_time_to_visit: string;
  average_temperature: string;
  currency: string;
  language: string;
  time_zone: string;
  latitude: number;
  longitude: number;
  attractions?: Attraction[];
  hotels?: Accommodation[];
  restaurants?: Restaurant[];
  activities?: Activity[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  ai_context?: {
    character: string;
    ideal_for: string[];
    travel_style: string[];
  };
}

// Attraction (POI) content type
export interface Attraction extends ContentstackEntry {
  slug: string;
  destination: Destination[];
  category: 'Landmark' | 'Museum' | 'Park' | 'Historical Site' | 'Entertainment' | 'Shopping' | 'Nightlife';
  description: string;
  featured_image: ContentstackAsset;
  gallery?: ContentstackAsset[];
  average_visit_duration: number; // in minutes
  entry_fee: number;
  currency: string;
  opening_hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  best_time_to_visit?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  booking_required: boolean;
  booking_url?: string;
  ai_tags?: string[];
  ai_recommendations?: string;
}

// Restaurant content type
export interface Restaurant extends ContentstackEntry {
  slug: string;
  destination: Destination[];
  cuisine_type: string;
  description: string;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  average_price_per_person: number;
  featured_image: ContentstackAsset;
  gallery?: ContentstackAsset[];
  address: string;
  latitude: number;
  longitude: number;
  opening_hours?: {
    [key: string]: string;
  };
  phone?: string;
  website?: string;
  reservation_required: boolean;
  reservation_url?: string;
  ai_tags?: string[];
}

// Accommodation content type
export interface Accommodation extends ContentstackEntry {
  slug: string;
  destination: Destination[];
  type: 'Hotel' | 'Hostel' | 'Apartment' | 'Villa' | 'Resort' | 'B&B';
  description: string;
  star_rating: number;
  price_per_night: number;
  currency: string;
  featured_image: ContentstackAsset;
  gallery?: ContentstackAsset[];
  address: string;
  latitude: number;
  longitude: number;
  amenities?: string[];
  booking_url?: string;
  ai_tags?: string[];
}

// Activity content type
export interface Activity extends ContentstackEntry {
  slug: string;
  destination: Destination[];
  category: 'Tour' | 'Adventure' | 'Cultural' | 'Food & Drink' | 'Water Sports' | 'Workshop' | 'Day Trip';
  description: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  featured_image: ContentstackAsset;
  gallery?: ContentstackAsset[];
  included?: string;
  not_included?: string;
  meeting_point?: string;
  booking_required: boolean;
  booking_url?: string;
  provider?: string;
  ai_tags?: string[];
}

// Itinerary content type
export interface Itinerary extends ContentstackEntry {
  slug: string;
  user_id?: string;
  user_email?: string;
  destinations: Destination[];
  start_date: string;
  end_date: string;
  number_of_days: number;
  number_of_travelers: number;
  travel_style?: string[];
  estimated_budget: number;
  currency: string;
  daily_plan: DailyPlan[];
  generated_by_ai: boolean;
  ai_prompt?: string;
  ai_model?: string;
  generation_date: string;
  status: 'Draft' | 'Published' | 'Booked' | 'Completed';
  total_price?: number;
  booking_confirmation_number?: string;
  booking_date?: string;
  is_public: boolean;
  views: number;
  likes: number;
  seo_title?: string;
  seo_description?: string;
}

// Daily Plan (Modular Block)
export interface DailyPlan {
  day_number: number;
  date: string;
  title: string;
  activities: ItineraryActivity[];
}

// Itinerary Activity
export interface ItineraryActivity {
  time: string;
  activity_type: 'Attraction' | 'Restaurant' | 'Activity' | 'Hotel' | 'Transport';
  activity_reference?: Attraction | Restaurant | Activity | Accommodation;
  custom_activity_title?: string;
  custom_activity_description?: string;
  duration: number;
  price?: number;
  notes?: string;
}

// Home Page content type
export interface HomePage extends ContentstackEntry {
  hero_title: string;
  hero_subtitle: string;
  hero_background_image: ContentstackAsset;
  hero_background_video?: ContentstackAsset;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;
  featured_destinations: Destination[];
  featured_destinations_title: string;
  how_it_works_title: string;
  how_it_works_steps: HowItWorksStep[];
  ai_features_title: string;
  ai_features: AIFeature[];
  recent_itineraries_title: string;
  recent_itineraries: Itinerary[];
  seo_title?: string;
  seo_description?: string;
}

// How It Works Step (Modular Block)
export interface HowItWorksStep {
  step_number: number;
  step_title: string;
  step_description: string;
  step_icon: string;
}

// AI Feature (Modular Block)
export interface AIFeature {
  feature_title: string;
  feature_description: string;
  feature_icon: string;
}

// Contentstack Asset type
export interface ContentstackAsset {
  uid: string;
  url: string;
  filename: string;
  content_type: string;
  title?: string;
  description?: string;
  dimension?: {
    width: number;
    height: number;
  };
  file_size?: string;
}

// Query response wrapper
export interface ContentstackResponse<T> {
  entries: T[];
  count: number;
  schema?: Record<string, unknown>;
}

// Single entry response
export interface ContentstackSingleResponse<T> {
  entry: T;
}

