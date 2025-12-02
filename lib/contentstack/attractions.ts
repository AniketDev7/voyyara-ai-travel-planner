/**
 * Contentstack queries for Attractions
 */

import { Stack } from './client';
import type { Attraction } from './types';

// Get all attractions
export async function getAllAttractions(limit: number = 100): Promise<Attraction[]> {
  try {
    const query = Stack.ContentType('attraction')
      .Query()
      .limit(limit)
      .includeReference('destination')
      .toJSON();

    const result = await query.find();
    return result[0] as Attraction[];
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

// Get attractions by destination UID
export async function getAttractionsByDestination(destinationUid: string): Promise<Attraction[]> {
  try {
    const query = Stack.ContentType('attraction')
      .Query()
      .where('destination', destinationUid)
      .toJSON();

    const result = await query.find();
    return result[0] as Attraction[];
  } catch (error) {
    console.error('Error fetching attractions by destination:', error);
    throw error;
  }
}

// Get a single attraction by UID
export async function getAttractionByUid(uid: string): Promise<Attraction | null> {
  try {
    const entry = await Stack.ContentType('attraction')
      .Entry(uid)
      .includeReference('destination')
      .toJSON()
      .fetch();

    return entry as Attraction;
  } catch (error) {
    console.error('Error fetching attraction by UID:', error);
    return null;
  }
}

// Get attractions by category
export async function getAttractionsByCategory(category: string): Promise<Attraction[]> {
  try {
    const query = Stack.ContentType('attraction')
      .Query()
      .where('category', category)
      .toJSON();

    const result = await query.find();
    return result[0] as Attraction[];
  } catch (error) {
    console.error('Error fetching attractions by category:', error);
    throw error;
  }
}

