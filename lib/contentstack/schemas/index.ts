/**
 * Contentstack Schema Definitions
 * 
 * These are the schema definitions for all content types in Voyyara.
 * Use these to:
 * 1. Create content types via CMA
 * 2. Reference TypeScript interfaces in the app
 * 3. Understand the content model
 */

export { 
  itineraryTemplateEnhancedSchema
} from './itinerary-template-enhanced';

export { 
  homepageContentSchema,
  type HomepageContent 
} from './homepage-content';

export { 
  siteSettingsSchema,
  type SiteSettings 
} from './site-settings';

/**
 * Content Type UIDs
 */
export const CONTENT_TYPES = {
  ITINERARY_TEMPLATE: 'itinerary_template_v2',
  HOMEPAGE_CONTENT: 'homepage_content',
  SITE_SETTINGS: 'site_settings',
  DESTINATION: 'destination',
  ABOUT_PAGE: 'about_page_content',
  CONTACT_PAGE: 'contact_page_content',
} as const;

/**
 * Quick Reference: Content Model Overview
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    VOYYARA CONTENT MODEL                        │
 * ├─────────────────────────────────────────────────────────────────┤
 * │                                                                 │
 * │  SINGLETON CONTENT TYPES (One entry each):                     │
 * │  ├── homepage_content    → All homepage text content           │
 * │  ├── site_settings       → Navigation, footer, branding        │
 * │  ├── about_page_content  → About page content                  │
 * │  └── contact_page_content→ Contact page content                │
 * │                                                                 │
 * │  MULTIPLE ENTRY CONTENT TYPES:                                 │
 * │  ├── destination         → Countries/Regions to visit          │
 * │  │   └── [Japan, Vietnam, Thailand, ...]                       │
 * │  │                                                             │
 * │  └── itinerary_template_v2 → Detailed trip itineraries         │
 * │      └── [Japan Cultural, Vietnam Adventure, ...]              │
 * │          ├── Rich day-by-day activities                        │
 * │          ├── Dining recommendations                            │
 * │          ├── Hidden gems                                       │
 * │          ├── Practical info                                    │
 * │          └── Personalization metadata                          │
 * │                                                                 │
 * │  REFERENCES:                                                   │
 * │  itinerary_template_v2 ──references──► destination            │
 * │  homepage_content.featured_destinations ──references──► destination │
 * │                                                                 │
 * └─────────────────────────────────────────────────────────────────┘
 */

