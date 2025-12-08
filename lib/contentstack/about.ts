/**
 * Contentstack - About Page Integration
 * Fetches About page content from CMS
 * Using TypeScript Delivery SDK
 */

import { Stack } from '@/lib/contentstack/client';

interface AboutPageData {
  title: string;
  hero_emoji?: string;
  hero_title: string;
  hero_subtitle?: string;
  story_content: string;
  mission_title: string;
  mission_description?: string;
}

export async function getAboutPageContent(): Promise<AboutPageData | null> {
  try {
    const result = await Stack.contentType('about_page_content')
      .entry()
      .query()
      .find<AboutPageData>();

    if (result.entries && result.entries.length > 0) {
      return result.entries[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}
