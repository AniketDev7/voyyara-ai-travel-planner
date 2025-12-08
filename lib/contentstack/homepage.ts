/**
 * Contentstack SDK functions for Homepage Content
 * Using TypeScript Delivery SDK
 */

import { Stack } from './client';

export interface HomepageContent {
  uid: string;
  title: string;
  hero: {
    tagline?: string;
    title_line1: string;
    title_highlight?: string;
    description: string;
    cta_primary_text?: string;
    cta_primary_link?: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
  };
  how_it_works: {
    title?: string;
    subtitle?: string;
    steps?: Array<{
      number?: string;
      step_title: string;
      step_description: string;
    }>;
  };
  why_voyyara: {
    title?: string;
    subtitle?: string;
    features?: Array<{
      icon?: string;
      feature_title: string;
      feature_description: string;
    }>;
    cta_text?: string;
    cta_link?: string;
  };
  featured_destinations?: {
    title?: string;
    subtitle?: string;
    destinations?: any[];
    view_all_text?: string;
    view_all_link?: string;
  };
  why_choose_us: {
    title?: string;
    subtitle?: string;
    features?: Array<{
      icon?: string;
      feature_title: string;
      feature_description: string;
    }>;
  };
  testimonials: {
    title?: string;
    subtitle?: string;
    reviews?: Array<{
      name: string;
      location?: string;
      avatar?: string;
      rating?: number;
      text: string;
    }>;
    stats?: Array<{
      number: string;
      label: string;
    }>;
  };
  final_cta: {
    icon?: string;
    title?: string;
    subtitle?: string;
    cta_primary_text?: string;
    cta_primary_link?: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
    trust_badges?: string[];
  };
}

/**
 * Fetch homepage content (singleton)
 */
export async function getHomepageContent(): Promise<HomepageContent | null> {
  try {
    const result = await Stack.contentType('homepage_content')
      .entry()
      .query()
      .find<HomepageContent>();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }
}
