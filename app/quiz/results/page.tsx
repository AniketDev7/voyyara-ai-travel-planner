'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';

interface Itinerary {
  uid: string;
  title: string;
  slug: string;
  destination?: { title: string } | { title: string }[];
  short_description?: string;
  price?: string;
  // V2 uses duration object with days/nights/display_text
  duration?: string | { days?: number; nights?: number; display_text?: string };
  hero_image?: { url: string };
  // V2 fields
  trip_type?: string;
  travel_style?: string;
  traveler_type?: string;
  // V2 pricing object
  pricing?: { base_price?: number; display_price?: string; price_display?: string };
  highlights?: { title?: string; highlight_title?: string; icon?: string }[];
}

interface UserPreferences {
  travel_style?: string;
  traveler_type?: string;
  interests?: string[];
  pace?: string;
  duration?: string;
}

// Helper to get destination title from V2 format
function getDestinationTitle(destination: Itinerary['destination']): string {
  if (!destination) return 'Asia';
  if (Array.isArray(destination)) {
    return destination[0]?.title || 'Asia';
  }
  return destination.title || 'Asia';
}

// Helper to format duration from V2 format
function formatDuration(duration: Itinerary['duration']): string {
  if (!duration) return '7 days';
  if (typeof duration === 'string') return duration;
  if (duration.display_text) return duration.display_text;
  if (duration.days) return `${duration.days} Days`;
  return '7 days';
}

// Helper to get price from V2 format
function getPrice(itinerary: Itinerary): string {
  if (itinerary.pricing?.display_price) return itinerary.pricing.display_price;
  if (itinerary.pricing?.price_display) return itinerary.pricing.price_display;
  if (itinerary.pricing?.base_price) return `From $${itinerary.pricing.base_price}`;
  if (itinerary.price) return itinerary.price;
  return 'Contact for price';
}

// Score an itinerary based on user preferences (V2 fields)
function scoreItinerary(itinerary: Itinerary, preferences: UserPreferences): number {
  let score = 0;
  
  // V2 uses travel_style and trip_type fields
  const travelStyle = itinerary.travel_style?.toLowerCase() || '';
  const tripType = itinerary.trip_type?.toLowerCase() || '';
  const itinTravelerType = itinerary.traveler_type?.toLowerCase() || '';
  const title = itinerary.title?.toLowerCase() || '';
  
  // Travel style matching (most important - 40 points)
  if (preferences.travel_style) {
    const userStyle = preferences.travel_style;
    
    // Direct match on V2 travel_style field
    if (userStyle === 'budget' || userStyle === 'backpacker') {
      if (travelStyle === 'budget' || tripType.includes('budget') || title.includes('budget')) score += 40;
    } else if (userStyle === 'luxury') {
      if (travelStyle === 'luxury' || tripType.includes('luxury') || title.includes('luxury')) score += 40;
    } else if (userStyle === 'mid_range') {
      if (travelStyle === 'mid_range' || (!travelStyle.includes('budget') && !travelStyle.includes('luxury'))) score += 30;
    }
  }
  
  // Duration matching (25 points) - V2 uses duration object with days field
  if (preferences.duration) {
    let durationDays = 0;
    
    if (typeof itinerary.duration === 'object' && itinerary.duration?.days) {
      durationDays = itinerary.duration.days;
    } else if (typeof itinerary.duration === 'string') {
      const daysMatch = itinerary.duration.match(/(\d+)\s*(?:days?|d)/i) || itinerary.duration.match(/(\d+)n/i);
      durationDays = parseInt(daysMatch?.[1] || '0');
    }
    
    if (preferences.duration === 'short' && durationDays >= 4 && durationDays <= 7) score += 25;
    else if (preferences.duration === 'medium' && durationDays >= 8 && durationDays <= 10) score += 25;
    else if (preferences.duration === 'long' && durationDays >= 10 && durationDays <= 14) score += 25;
    else if (preferences.duration === 'extended' && durationDays >= 14 && durationDays <= 20) score += 25;
    else if (durationDays > 0) score += 10; // Partial match
  }
  
  // Interest matching (25 points) - Use trip_type
  if (preferences.interests && Array.isArray(preferences.interests)) {
    const interests = preferences.interests;
    if (interests.includes('culture') && (tripType.includes('cultural') || title.includes('cultural'))) score += 15;
    if (interests.includes('food') && (tripType.includes('food') || title.includes('food'))) score += 15;
    if (interests.includes('adventure') && (tripType.includes('adventure') || title.includes('adventure'))) score += 15;
    if (interests.includes('nature') && (tripType.includes('nature') || title.includes('nature'))) score += 15;
  }
  
  // Traveler type matching (10 points) - V2 has traveler_type field
  if (preferences.traveler_type && itinTravelerType) {
    if (preferences.traveler_type === itinTravelerType) score += 10;
  } else if (preferences.traveler_type) {
    // Fallback to trip type heuristics
    if (preferences.traveler_type === 'couple' && tripType.includes('cultural')) score += 10;
    if (preferences.traveler_type === 'family' && tripType.includes('family')) score += 10;
    if (preferences.traveler_type === 'solo' && tripType.includes('adventure')) score += 10;
    if (preferences.traveler_type === 'friends' && tripType.includes('adventure')) score += 10;
  }
  
  return score;
}

export default function QuizResultsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPrefs = localStorage.getItem('voyyara_preferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(parsed);
      } catch (e) {
        console.error('Error parsing preferences:', e);
      }
    }
    
    // Fetch all itineraries
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries');
      if (!response.ok) throw new Error('Failed to fetch itineraries');
      const data = await response.json();
      setItineraries(data.itineraries || []);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Score and sort itineraries
  const scoredItineraries = itineraries
    .map(itinerary => ({
      ...itinerary,
      matchScore: preferences ? scoreItinerary(itinerary, preferences) : 0,
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const topMatches = scoredItineraries.slice(0, 3);
  const otherOptions = scoredItineraries.slice(3);

  const getMatchLabel = (score: number): { label: string; color: string } => {
    if (score >= 50) return { label: 'Perfect Match', color: 'bg-green-500' };
    if (score >= 30) return { label: 'Great Match', color: 'bg-blue-500' };
    if (score >= 15) return { label: 'Good Option', color: 'bg-yellow-500' };
    return { label: 'Explore', color: 'bg-gray-400' };
  };

  const getPreferenceLabel = (key: string, value: string | string[]): string => {
    const labels: Record<string, Record<string, string>> = {
      travel_style: {
        luxury: '👑 Luxury',
        mid_range: '⭐ Mid-Range',
        budget: '💰 Budget',
        backpacker: '🎒 Backpacker',
      },
      traveler_type: {
        solo: '🚶 Solo',
        couple: '💑 Couple',
        family: '👨‍👩‍👧‍👦 Family',
        friends: '👯 Friends',
      },
      pace: {
        relaxed: '🐢 Relaxed',
        moderate: '🦊 Moderate',
        packed: '🐆 Action-Packed',
      },
      duration: {
        short: '📅 Short Trip (4-7 days)',
        medium: '🗓️ Medium Trip (8-10 days)',
        long: '📆 Long Trip (10-14 days)',
        extended: '🌍 Extended (14-20 days)',
      },
    };
    
    if (key === 'interests' && Array.isArray(value)) {
      const interestLabels: Record<string, string> = {
        culture: '🏛️ Culture',
        food: '🍜 Food',
        adventure: '🏔️ Adventure',
        nature: '🌿 Nature',
        relaxation: '🧘 Relaxation',
        photography: '📸 Photography',
        nightlife: '🎉 Nightlife',
        shopping: '🛍️ Shopping',
      };
      return value.map(v => interestLabels[v] || v).join(', ');
    }
    
    return labels[key]?.[value as string] || String(value);
  };

  if (!preferences) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Preferences Found</h1>
            <p className="text-gray-600 mb-8">Take the quiz first to get personalized recommendations!</p>
            <Link 
              href="/quiz"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              Take the Quiz →
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-6xl mb-4 block">✨</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Perfect Trips
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your preferences, we've found the best matching itineraries for you
            </p>
          </motion.div>

          {/* User Preferences Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Travel Profile</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(preferences).map(([key, value]) => (
                <span
                  key={key}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {getPreferenceLabel(key, value)}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/quiz" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                ← Retake Quiz
              </Link>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Finding your perfect matches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Top Matches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🎯</span> Top Matches for You
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {topMatches.map((itinerary, index) => {
                    const match = getMatchLabel(itinerary.matchScore);
                    return (
                      <motion.div
                        key={itinerary.uid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                      >
                        <div className="relative h-48">
                          {itinerary.hero_image?.url ? (
                            <Image
                              src={itinerary.hero_image.url}
                              alt={itinerary.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
                          )}
                          <div className={`absolute top-4 left-4 ${match.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            {match.label}
                          </div>
                          {index === 0 && (
                            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                              🏆 Best Match
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-purple-600 font-medium mb-1">
                            {getDestinationTitle(itinerary.destination)}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {itinerary.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {itinerary.short_description}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-purple-600 font-bold">{getPrice(itinerary)}</span>
                            <span className="text-gray-500 text-sm">{formatDuration(itinerary.duration)}</span>
                          </div>
                          <Link
                            href={`/itinerary/${itinerary.slug}`}
                            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                          >
                            View Itinerary →
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Other Options */}
              {otherOptions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>🌍</span> More Options to Explore
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {otherOptions.map((itinerary) => {
                      const match = getMatchLabel(itinerary.matchScore);
                      return (
                        <Link
                          key={itinerary.uid}
                          href={`/itinerary/${itinerary.slug}`}
                          className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              {itinerary.hero_image?.url ? (
                                <Image
                                  src={itinerary.hero_image.url}
                                  alt={itinerary.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`inline-block ${match.color} text-white px-2 py-0.5 rounded text-xs font-medium mb-1`}>
                                {match.label}
                              </div>
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                {itinerary.title}
                              </h3>
                              <p className="text-purple-600 text-sm font-medium">{getPrice(itinerary)}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
              >
                <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
                <p className="mb-6 opacity-90">Let our AI create a custom itinerary just for you</p>
                <Link
                  href="/planner"
                  className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  Plan with AI →
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

