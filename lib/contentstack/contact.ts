/**
 * Contentstack - Contact Page Integration
 * Fetches Contact page content from CMS
 * Using TypeScript Delivery SDK
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
    const result = await Stack.contentType('contact_page_content')
      .entry()
      .query()
      .find<ContactPageData>();

    if (result.entries && result.entries.length > 0) {
      return result.entries[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}
