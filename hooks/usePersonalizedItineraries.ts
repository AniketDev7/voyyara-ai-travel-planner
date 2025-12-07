'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePreferences } from './usePreferences';
import { 
  scoreItineraryMatch, 
  getPersonalizedRecommendations 
} from '@/lib/personalize/preferences-to-personalize';

interface Itinerary {
  uid: string;
  title: string;
  slug: string;
  type?: string;
  travel_style?: string;
  traveler_type?: string;
  duration?: { days?: number; nights?: number; display_text?: string } | string;
  price?: string;
  short_description?: string;
  destination?: any[];
  highlights?: any[];
  hero_image?: { url: string };
}

interface PersonalizedItinerary extends Itinerary {
  matchScore: number;
  matchReasons: string[];
}

export function usePersonalizedItineraries(itineraries: Itinerary[]) {
  const { preferences, hasCompletedQuiz, isLoading } = usePreferences();
  
  const personalizedItineraries = useMemo(() => {
    if (!hasCompletedQuiz || !preferences || itineraries.length === 0) {
      return itineraries.map(itin => ({
        ...itin,
        matchScore: 0,
        matchReasons: [],
      }));
    }
    
    // Score each itinerary and generate match reasons
    return itineraries.map(itin => {
      const score = scoreItineraryMatch(itin, preferences);
      const reasons: string[] = [];
      
      // Generate reasons for the match
      if (preferences.travel_style && itin.travel_style === preferences.travel_style) {
        const styleLabels: Record<string, string> = {
          luxury: 'Matches your luxury style',
          mid_range: 'Matches your comfort preferences',
          budget: 'Great for your budget',
          backpacker: 'Perfect for backpackers',
        };
        reasons.push(styleLabels[preferences.travel_style as string] || 'Matches your style');
      }
      
      if (preferences.traveler_type && itin.traveler_type === preferences.traveler_type) {
        const typeLabels: Record<string, string> = {
          solo: 'Ideal for solo travelers',
          couple: 'Perfect for couples',
          family: 'Family-friendly',
          friends: 'Great for group travel',
        };
        reasons.push(typeLabels[preferences.traveler_type as string] || 'Matches your group type');
      }
      
      if (preferences.interests && itin.type) {
        const interests = Array.isArray(preferences.interests) 
          ? preferences.interests 
          : [preferences.interests];
        
        if (interests.includes(itin.type)) {
          const interestLabels: Record<string, string> = {
            cultural: 'Rich in culture',
            food_culinary: 'Amazing food experiences',
            adventure: 'Thrilling adventures',
            nature: 'Beautiful nature',
            relaxation: 'Relaxing getaway',
          };
          reasons.push(interestLabels[itin.type] || `Includes ${itin.type} experiences`);
        }
      }
      
      return {
        ...itin,
        matchScore: score,
        matchReasons: reasons,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [itineraries, preferences, hasCompletedQuiz]);
  
  // Get top recommendations (score > 50)
  const topRecommendations = useMemo(() => {
    return personalizedItineraries.filter(itin => itin.matchScore > 50);
  }, [personalizedItineraries]);
  
  // Get "you might also like" (score between 20-50)
  const youMightLike = useMemo(() => {
    return personalizedItineraries.filter(
      itin => itin.matchScore > 20 && itin.matchScore <= 50
    );
  }, [personalizedItineraries]);
  
  return {
    personalizedItineraries,
    topRecommendations,
    youMightLike,
    hasCompletedQuiz,
    isLoading,
    preferences,
  };
}

/**
 * Hook to get personalization status for a single itinerary
 */
export function useItineraryPersonalization(itinerary: Itinerary | null) {
  const { preferences, hasCompletedQuiz } = usePreferences();
  
  const personalization = useMemo(() => {
    if (!hasCompletedQuiz || !preferences || !itinerary) {
      return { matchScore: 0, matchReasons: [], isPersonalized: false };
    }
    
    const score = scoreItineraryMatch(itinerary, preferences);
    const reasons: string[] = [];
    
    if (preferences.travel_style && itinerary.travel_style === preferences.travel_style) {
      reasons.push(`Matches your ${preferences.travel_style} travel style`);
    }
    
    if (preferences.traveler_type && itinerary.traveler_type === preferences.traveler_type) {
      reasons.push(`Perfect for ${preferences.traveler_type} travelers`);
    }
    
    if (preferences.interests) {
      const interests = Array.isArray(preferences.interests) 
        ? preferences.interests 
        : [preferences.interests];
      
      if (itinerary.type && interests.includes(itinerary.type)) {
        reasons.push(`Includes your favorite: ${itinerary.type}`);
      }
    }
    
    return {
      matchScore: score,
      matchReasons: reasons,
      isPersonalized: score > 0,
    };
  }, [itinerary, preferences, hasCompletedQuiz]);
  
  return personalization;
}

