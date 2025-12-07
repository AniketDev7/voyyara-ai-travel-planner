/**
 * Contentstack - About Page Integration
 * Fetches About page content from CMS
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
    const response = await Stack.ContentType('about_page_content')
      .Query()
      .toJSON()
      .find();

    if (response && response[0] && response[0].length > 0) {
      return response[0][0] as unknown as AboutPageData;
    }

    return null;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

