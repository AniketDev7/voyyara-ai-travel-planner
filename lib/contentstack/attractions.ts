/**
 * Contentstack queries for Attractions
 * Using TypeScript Delivery SDK
 */

import { Stack, QueryOperation } from './client';
import type { Attraction } from './types';

// Get all attractions
export async function getAllAttractions(limit: number = 100): Promise<Attraction[]> {
  try {
    const result = await Stack.contentType('attraction')
      .entry()
      .includeReference('destination')
      .query()
      .limit(limit)
      .find<Attraction>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

// Get attractions by destination UID
export async function getAttractionsByDestination(destinationUid: string): Promise<Attraction[]> {
  try {
    const result = await Stack.contentType('attraction')
      .entry()
      .query()
      .where('destination', QueryOperation.EQUALS, destinationUid)
      .find<Attraction>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching attractions by destination:', error);
    throw error;
  }
}

// Get a single attraction by UID
export async function getAttractionByUid(uid: string): Promise<Attraction | null> {
  try {
    const entry = await Stack.contentType('attraction')
      .entry(uid)
      .includeReference('destination')
      .fetch<Attraction>();

    return entry;
  } catch (error) {
    console.error('Error fetching attraction by UID:', error);
    return null;
  }
}

// Get attractions by category
export async function getAttractionsByCategory(category: string): Promise<Attraction[]> {
  try {
    const result = await Stack.contentType('attraction')
      .entry()
      .query()
      .where('category', QueryOperation.EQUALS, category)
      .find<Attraction>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching attractions by category:', error);
    throw error;
  }
}
