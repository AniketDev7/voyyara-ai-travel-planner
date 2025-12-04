/**
 * Contentstack - Contact Page Integration
 * Fetches Contact page content from CMS
 */

import { Stack } from '@/lib/contentstack/client';

interface ContactPageData {
  title: string;
  hero_emoji?: string;
  hero_title: string;
  hero_subtitle?: string;
  email: string;
  email_description?: string;
}

export async function getContactPageContent(): Promise<ContactPageData | null> {
  try {
    const response = await Stack.ContentType('contact_page_content')
      .Query()
      .toJSON()
      .find();

    if (response && response[0] && response[0].length > 0) {
      return response[0][0] as unknown as ContactPageData;
    }

    return null;
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}

