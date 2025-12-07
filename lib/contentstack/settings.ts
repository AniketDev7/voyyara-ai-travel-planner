/**
 * Contentstack SDK functions for Site Settings
 */

import { Stack } from './client';

export interface SiteSettings {
  uid: string;
  title: string;
  branding: {
    site_name: string;
    tagline?: string;
    logo_icon?: string;
    logo_image?: { url: string };
  };
  main_nav?: Array<{
    label: string;
    url: string;
    new_tab?: boolean;
  }>;
  header_ctas?: {
    sign_in_text?: string;
    sign_in_link?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
  };
  footer: {
    description?: string;
    copyright?: string;
  };
  footer_links?: Array<{
    section_title: string;
    link1_label?: string;
    link1_url?: string;
    link2_label?: string;
    link2_url?: string;
  }>;
  social_links?: Array<{
    platform: string;
    url: string;
  }>;
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
  default_seo?: {
    title_suffix?: string;
    description?: string;
    og_image?: { url: string };
  };
}

/**
 * Fetch site settings (singleton)
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await Stack.ContentType('site_settings')
      .Query()
      .toJSON()
      .find();
    
    if (response[0] && response[0].length > 0) {
      return response[0][0] as SiteSettings;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

