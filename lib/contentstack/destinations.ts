/**
 * Contentstack queries for Destinations
 */

import { Stack } from './client';
import type { Destination } from './types';

// Get all destinations
export async function getAllDestinations(limit: number = 50): Promise<Destination[]> {
  try {
    const query = Stack.ContentType('destination')
      .Query()
      .limit(limit)
      .includeReference('attractions')
      .includeReference('hotels')
      .includeReference('restaurants')
      .includeReference('activities')
      .toJSON();

    const result = await query.find();
    return result[0] as Destination[];
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
}

// Get a single destination by slug
export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const query = Stack.ContentType('destination')
      .Query()
      .where('slug', slug)
      .includeReference('attractions')
      .includeReference('hotels')
      .includeReference('restaurants')
      .includeReference('activities')
      .toJSON();

    const result = await query.find();
    const entries = result[0] as Destination[];
    return entries.length > 0 ? entries[0] : null;
  } catch (error) {
    console.error('Error fetching destination by slug:', error);
    throw error;
  }
}

// Get a single destination by UID
export async function getDestinationByUid(uid: string): Promise<Destination | null> {
  try {
    const entry = await Stack.ContentType('destination')
      .Entry(uid)
      .includeReference('attractions')
      .includeReference('hotels')
      .includeReference('restaurants')
      .includeReference('activities')
      .toJSON()
      .fetch();

    return entry as Destination;
  } catch (error) {
    console.error('Error fetching destination by UID:', error);
    return null;
  }
}

// Get destinations by region
export async function getDestinationsByRegion(region: string): Promise<Destination[]> {
  try {
    const query = Stack.ContentType('destination')
      .Query()
      .where('region', region)
      .toJSON();

    const result = await query.find();
    return result[0] as Destination[];
  } catch (error) {
    console.error('Error fetching destinations by region:', error);
    throw error;
  }
}

// Search destinations (basic text search)
export async function searchDestinations(searchTerm: string): Promise<Destination[]> {
  try {
    const query = Stack.ContentType('destination')
      .Query()
      .regex('title', searchTerm, 'i') // Case-insensitive regex search
      .toJSON();

    const result = await query.find();
    return result[0] as Destination[];
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw error;
  }
}

// Get featured destinations (for homepage)
export async function getFeaturedDestinations(limit: number = 6): Promise<Destination[]> {
  try {
    const query = Stack.ContentType('destination')
      .Query()
      .limit(limit)
      .toJSON();

    const result = await query.find();
    return result[0] as Destination[];
  } catch (error) {
    console.error('Error fetching featured destinations:', error);
    throw error;
  }
}

