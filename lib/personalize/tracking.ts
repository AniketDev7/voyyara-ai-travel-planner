/**
 * Contentstack Personalize - Frontend Integration
 * Tracks user attributes and sends to Personalize for variant matching
 */

'use client';

export interface PersonalizeAttributes {
  user_currency?: string;
  user_language?: string;
  travel_type?: string;
  price_type?: string;
  travel_destination?: string;
  [key: string]: string | undefined;
}

/**
 * Initialize Personalize tracking
 * Call this once when the app loads
 */
export function initializePersonalize(projectUid: string) {
  if (typeof window === 'undefined') return;

  // Store project UID globally
  (window as any).__PERSONALIZE_PROJECT_UID = projectUid;

  // Load any saved attributes from localStorage
  const savedAttrs = localStorage.getItem('voyyara_personalize_attrs');
  if (savedAttrs) {
    try {
      const attrs = JSON.parse(savedAttrs);
      (window as any).__PERSONALIZE_ATTRIBUTES = attrs;
    } catch (e) {
      console.error('Error loading personalize attributes:', e);
    }
  }
}

/**
 * Set a single attribute
 * This will be used by Contentstack Personalize to match audiences
 */
export function setPersonalizeAttribute(key: string, value: string) {
  if (typeof window === 'undefined') return;

  // Get current attributes
  const currentAttrs = (window as any).__PERSONALIZE_ATTRIBUTES || {};
  
  // Update
  currentAttrs[key] = value;
  (window as any).__PERSONALIZE_ATTRIBUTES = currentAttrs;

  // Save to localStorage for persistence
  localStorage.setItem('voyyara_personalize_attrs', JSON.stringify(currentAttrs));

  // Log for debugging (remove in production)
  console.log('[Personalize] Attribute set:', key, '=', value);
}

/**
 * Set multiple attributes at once
 */
export function setPersonalizeAttributes(attributes: PersonalizeAttributes) {
  if (typeof window === 'undefined') return;

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      setPersonalizeAttribute(key, value);
    }
  });
}

/**
 * Get current attributes
 */
export function getPersonalizeAttributes(): PersonalizeAttributes {
  if (typeof window === 'undefined') return {};

  return (window as any).__PERSONALIZE_ATTRIBUTES || {};
}

/**
 * Get project UID
 */
export function getPersonalizeProjectUid(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  return (window as any).__PERSONALIZE_PROJECT_UID;
}

/**
 * Track an event (for analytics)
 */
export function trackPersonalizeEvent(eventKey: string, metadata?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  console.log('[Personalize] Event tracked:', eventKey, metadata);
  
  // In a real implementation, this would send to Contentstack Personalize API
  // For now, just log it
}

/**
 * Build query params for variant fetching
 * This creates the format Contentstack expects for variant matching
 */
export function getVariantQueryParams(): string {
  const attrs = getPersonalizeAttributes();
  const projectUid = getPersonalizeProjectUid();

  if (!projectUid) return '';

  // Build query string with attributes
  const params = new URLSearchParams();
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (value) {
      params.append(`personalize_${key}`, value);
    }
  });

  return params.toString();
}

