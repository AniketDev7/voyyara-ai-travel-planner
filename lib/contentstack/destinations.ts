/**
 * Contentstack queries for Destinations
 * Using TypeScript Delivery SDK
 */

import { Stack, QueryOperation } from './client';
import type { Destination } from './types';

// Response type from the SDK
interface FindResponse<T> {
  entries: T[];
  count?: number;
}

// Get all destinations
export async function getAllDestinations(limit: number = 50): Promise<Destination[]> {
  try {
    const result = await Stack.contentType('destination')
      .entry()
      .includeReference('attractions', 'hotels', 'restaurants', 'activities')
      .query()
      .limit(limit)
      .find<Destination>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
}

// Get a single destination by slug
export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const result = await Stack.contentType('destination')
      .entry()
      .includeReference('attractions', 'hotels', 'restaurants', 'activities')
      .query()
      .where('slug', QueryOperation.EQUALS, slug)
      .find<Destination>();

    const entries = result.entries || [];
    return entries.length > 0 ? entries[0] : null;
  } catch (error) {
    console.error('Error fetching destination by slug:', error);
    throw error;
  }
}

// Get a single destination by UID
export async function getDestinationByUid(uid: string): Promise<Destination | null> {
  try {
    const entry = await Stack.contentType('destination')
      .entry(uid)
      .includeReference('attractions', 'hotels', 'restaurants', 'activities')
      .fetch<Destination>();

    return entry;
  } catch (error) {
    console.error('Error fetching destination by UID:', error);
    return null;
  }
}

// Get destinations by region
export async function getDestinationsByRegion(region: string): Promise<Destination[]> {
  try {
    const result = await Stack.contentType('destination')
      .entry()
      .query()
      .where('region', QueryOperation.EQUALS, region)
      .find<Destination>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching destinations by region:', error);
    throw error;
  }
}

// Search destinations (basic text search)
export async function searchDestinations(searchTerm: string): Promise<Destination[]> {
  try {
    const result = await Stack.contentType('destination')
      .entry()
      .query()
      .regex('title', searchTerm, 'i') // Case-insensitive regex search
      .find<Destination>();

    return result.entries || [];
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw error;
  }
}

// Get featured destinations (for homepage)
export async function getFeaturedDestinations(limit: number = 6): Promise<Destination[]> {
  try {
    const result = await Stack.contentType('destination')
      .entry()
      .query()
      .limit(limit)
      .find<Destination>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching featured destinations:', error);
    throw error;
  }
}
