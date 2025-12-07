'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { renderJsonRTE, extractTextFromRTE, safeRenderContent } from '@/lib/utils/render-json-rte';
import { useForexConversion } from '@/hooks/useForexConversion';

interface MealRecommendation {
  meal_type: string;
  venue_name: string;
  cuisine_type: string;
  price_range: string;
  description: string;
  pro_tip?: string;
}

interface Activity {
  time: string;
  activity_title: string;
  activity_description: string;
  activity_type?: string;
  duration_minutes?: number;
  cost_estimate?: string;
  booking_required?: boolean;
  booking_url?: string;
  pro_tip?: string;
}

interface DayPlan {
  day_number: string;
  day_title: string;
  day_theme?: string;
  day_overview?: any;
  day_image?: { url: string } | null;
  day_image_url?: string;
  activities?: Activity[];
  meals?: MealRecommendation[];
  accommodation?: {
    name: string;
    type: string;
    area: string;
    price_range: string;
    description: string;
  };
  pro_tips?: string[];
  walking_distance?: string;
  budget_summary?: string;
}

interface HiddenGem {
  name: string;
  category: string;
  description: string;
  why_special: string;
  best_time: string;
  local_tip: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  price_range: string;
  specialty_dish: string;
  description: string;
  reservation_tip: string;
  address?: string;
}

interface Neighborhood {
  name: string;
  vibe: string;
  best_for: string;
  must_see: string;
  local_experience: string;
}

interface SeasonalEvent {
  event_name: string;
  date_range: string;
  description: string;
  insider_tip: string;
}

interface TransformedItinerary {
  destination: string;
  type: string;
  name: string;
  duration: string;
  heroImage: string;
  description: string;
  longDescription?: any;
  price: string;
  difficulty_level?: string;
  best_season?: string;
  group_size?: string;
  included: string[];
  not_included?: string[];
  highlights: { icon: string; title: string; description?: string }[];
  dayByDay: DayPlan[];
  hiddenGems?: HiddenGem[];
  diningGuide?: {
    restaurants?: Restaurant[];
    street_food?: { name: string; description: string; where_to_find: string }[];
    food_etiquette?: string[];
  };
  neighborhoods?: Neighborhood[];
  seasonalEvents?: SeasonalEvent[];
  practicalInfo?: {
    transportation?: { mode: string; description: string; cost_estimate: string }[];
    money_tips?: string[];
    safety_tips?: string[];
    packing_essentials?: string[];
    useful_phrases?: { phrase: string; meaning: string; pronunciation: string }[];
  };
}

interface PersonalizationInfo {
  travelStyle: string;
  variantApplied: boolean;
  variantType: string | null;
}

export default function ItineraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [itinerary, setItinerary] = useState<TransformedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllDays, setShowAllDays] = useState(false);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hidden-gems' | 'dining' | 'practical'>('itinerary');
  const [personalization, setPersonalization] = useState<PersonalizationInfo | null>(null);
  
  // Use forex conversion hook for real-time currency conversion
  const { currency, convertPrice, symbol } = useForexConversion();

  const fetchItinerary = useCallback(async () => {
    try {
      // Get user's travel style preference from quiz
      const savedPrefs = localStorage.getItem('voyyara_preferences');
      const prefs = savedPrefs ? JSON.parse(savedPrefs) : null;
      const travelStyle = prefs?.travel_style || '';
      
      // Fetch itinerary with personalization based on quiz preferences
      const url = travelStyle 
        ? `/api/itinerary/${resolvedParams.slug}?style=${travelStyle}`
        : `/api/itinerary/${resolvedParams.slug}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.itinerary) {
        // Store personalization info
        if (data.personalization) {
          setPersonalization(data.personalization);
        }
        
        const cms = data.itinerary;
        const transformed: TransformedItinerary = {
          destination: cms.destination?.[0]?.title || cms.destination || 'Destination',
          type: cms.type,
          name: cms.title,
          duration: cms.duration,
          heroImage: cms.hero_image?.url || cms.hero_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920',
          description: cms.short_description || extractTextFromRTE(cms.overview),
          longDescription: cms.detailed_description || cms.overview,
          price: cms.price, // Store base price, convert on display
          difficulty_level: cms.difficulty_level,
          best_season: cms.best_season,
          group_size: cms.group_size,
          included: cms.included_items || cms.whats_included || [],
          not_included: cms.not_included || [],
          highlights: cms.highlights || [],
          dayByDay: (cms.day_by_day || cms.detailed_itinerary || []).map((day: any) => ({
            day_number: day.day_number,
            day_title: day.day_title,
            day_theme: day.day_theme,
            day_overview: day.day_overview || day.overview,
            day_image_url: day.day_image?.url || day.day_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
            activities: day.activities?.map((act: any) => ({
              time: act.time,
              activity_title: act.activity_title,
              activity_description: act.activity_description,
              activity_type: act.activity_type,
              duration_minutes: act.duration_minutes,
              cost_estimate: act.cost_estimate,
              booking_required: act.booking_required,
              booking_url: act.booking_url,
              pro_tip: act.pro_tip,
            })) || [],
            meals: day.meals || [],
            accommodation: day.accommodation,
            pro_tips: day.pro_tips || [],
            walking_distance: day.walking_distance,
            budget_summary: day.budget_summary,
          })),
          hiddenGems: cms.hidden_gems || [],
          diningGuide: cms.dining_guide,
          neighborhoods: cms.neighborhoods || [],
          seasonalEvents: cms.seasonal_events || [],
          practicalInfo: cms.practical_info,
        };
        setItinerary(transformed);
      } else {
        setItinerary(getMockItinerary(resolvedParams.slug));
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setItinerary(getMockItinerary(resolvedParams.slug));
    }
    
    setLoading(false);
  }, [resolvedParams.slug]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  function getMockItinerary(slug: string): TransformedItinerary {
    const parts = slug.split('-');
    const destination = parts.slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
      destination,
      type: 'custom',
      name: 'Itinerary Currently Unavailable',
      duration: '7N 8D',
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920',
      description: 'This itinerary is being updated in our CMS. Please check back soon or contact us for details.',
      price: 'Contact for pricing',
      included: ['Please contact us for full package details'],
      highlights: [
        { icon: '🧳', title: 'Custom Planning', description: 'Use our AI planner for custom itineraries' },
        { icon: '📞', title: 'Contact Us', description: 'Speak with a travel expert' },
      ],
      dayByDay: [],
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="text-6xl mb-4">✈️</div>
          <p className="text-gray-600 font-medium">Loading your adventure...</p>
        </motion.div>
      </div>
    );
  }

  if (!itinerary) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Personalization Banner */}
      {personalization?.variantApplied && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-3 px-4"
        >
          <div className="container mx-auto flex items-center justify-center gap-3 text-sm md:text-base">
            <span className="text-xl">✨</span>
            <span className="font-medium">
              This itinerary has been personalized for your 
              <strong className="mx-1">
                {personalization.variantType === 'luxury' ? '👑 Luxury' : 
                 personalization.variantType === 'budget' || personalization.variantType === 'backpacker' ? '💰 Budget' : 
                 '⭐ ' + personalization.variantType}
              </strong>
              travel style!
            </span>
            <span className="hidden md:inline text-white/70">|</span>
            <span className="hidden md:inline text-white/80">
              Based on your quiz answers
            </span>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${itinerary.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30">
                {itinerary.duration}
              </span>
              <span className="px-4 py-2 bg-purple-600 rounded-full text-white font-semibold">
                {itinerary.destination}
              </span>
              {itinerary.difficulty_level && (
                <span className="px-4 py-2 bg-green-500/80 rounded-full text-white font-semibold">
                  {itinerary.difficulty_level}
                </span>
              )}
              {itinerary.best_season && (
                <span className="px-4 py-2 bg-orange-500/80 rounded-full text-white font-semibold">
                  🌸 {itinerary.best_season}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
              {itinerary.name}
            </h1>
            <div className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl">
              {safeRenderContent(itinerary.description)}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-sm text-white/70">Starting from</div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {convertPrice(itinerary.price)}
                </div>
                <div className="text-sm text-white/70">per person</div>
                
                {/* Personalization Badge */}
                {personalization?.variantApplied && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white font-bold shadow-lg animate-pulse">
                      ✨ Personalized for {personalization.variantType === 'luxury' ? '👑 Luxury' : '💰 Budget'} Traveler
                    </span>
                  </div>
                )}
                
                {currency !== 'USD' && !personalization?.variantApplied && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                      💱 Converted to {currency}
                    </span>
                  </div>
                )}
              </div>
              {itinerary.group_size && (
                <div className="border-l border-white/30 pl-6">
                  <div className="text-sm text-white/70">Group Size</div>
                  <div className="text-xl font-bold text-white">{itinerary.group_size}</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
            {[
              { id: 'itinerary', label: '📅 Itinerary', icon: '📅' },
              { id: 'hidden-gems', label: '💎 Hidden Gems', icon: '💎' },
              { id: 'dining', label: '🍜 Dining Guide', icon: '🍜' },
              { id: 'practical', label: '🎒 Practical Info', icon: '🎒' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      {itinerary.highlights.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {itinerary.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-3">{highlight.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{highlight.title}</div>
                  {highlight.description && (
                    <div className="text-sm text-gray-600">{highlight.description}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Based on Tab */}
      {activeTab === 'itinerary' && (
        <>
          {/* Long Description */}
          {itinerary.longDescription && (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto prose prose-lg">
                  {renderJsonRTE(itinerary.longDescription, { className: 'text-gray-700' })}
                </div>
              </div>
            </section>
          )}

          {/* Day by Day Itinerary */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">Day-by-Day Journey</h2>
              <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                Every moment curated for an unforgettable experience
              </p>

              <div className="max-w-6xl mx-auto space-y-16">
                {(showAllDays ? itinerary.dayByDay : itinerary.dayByDay.slice(0, 3)).map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Image Side */}
                      <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                          <div
                            className="h-80 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                            style={{ backgroundImage: `url(${day.day_image_url})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-6 left-6 bg-white px-6 py-3 rounded-full shadow-lg">
                            <span className="text-2xl font-bold text-gray-900">Day {day.day_number}</span>
                          </div>
                          {day.day_theme && (
                            <div className="absolute bottom-6 left-6 right-6">
                              <span className="px-4 py-2 bg-purple-600/90 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                {day.day_theme}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Day Overview */}
                        {day.day_overview && (
                          <div className="mt-6 p-6 bg-purple-50 rounded-2xl">
                            <h4 className="font-bold text-purple-900 mb-2">📖 Day Overview</h4>
                            <div className="text-gray-700 text-sm">
                              {renderJsonRTE(day.day_overview)}
                            </div>
                          </div>
                        )}

                        {/* Accommodation */}
                        {day.accommodation && (
                          <div className="mt-4 p-6 bg-blue-50 rounded-2xl">
                            <h4 className="font-bold text-blue-900 mb-2">🏨 Tonight's Stay</h4>
                            <p className="font-semibold text-gray-900">{day.accommodation.name}</p>
                            <p className="text-sm text-gray-600">{day.accommodation.type} • {day.accommodation.area}</p>
                            <p className="text-sm text-gray-500 mt-1">{day.accommodation.price_range}</p>
                            {day.accommodation.description && (
                              <div className="text-sm text-gray-700 mt-2">{safeRenderContent(day.accommodation.description)}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content Side */}
                      <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                        <h3 className="text-3xl font-bold mb-6 text-gray-900">{day.day_title}</h3>
                        
                        {/* Activities */}
                        <div className="space-y-4">
                          {day.activities?.map((activity, actIndex) => (
                            <Card key={actIndex} className="border-l-4 border-purple-500 rounded-xl hover:shadow-lg transition-all group">
                              <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="min-w-[90px] px-4 py-3 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                      <span className="text-xs font-bold text-purple-700 whitespace-nowrap">{activity.time}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-lg text-gray-900">{activity.activity_title}</h4>
                                      {activity.booking_required && (
                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                          Booking Required
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-gray-600">{safeRenderContent(activity.activity_description)}</div>
                                    
                                    {/* Activity Details */}
                                    <div className="flex flex-wrap gap-3 mt-3">
                                      {activity.duration_minutes && (
                                        <span className="text-xs text-gray-500">⏱️ {activity.duration_minutes} min</span>
                                      )}
                                      {activity.cost_estimate && (
                                        <span className="text-xs text-gray-500">💰 {activity.cost_estimate}</span>
                                      )}
                                      {activity.activity_type && (
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{activity.activity_type}</span>
                                      )}
                                    </div>
                                    
                                    {/* Pro Tip */}
                                    {activity.pro_tip && (
                                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-sm text-yellow-800">💡 <strong>Pro Tip:</strong> {activity.pro_tip}</p>
                                      </div>
                                    )}
                                    
                                    {activity.booking_url && (
                                      <a
                                        href={activity.booking_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium"
                                      >
                                        Book Now →
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Meals for the Day */}
                        {day.meals && day.meals.length > 0 && (
                          <div className="mt-6 p-6 bg-orange-50 rounded-2xl">
                            <h4 className="font-bold text-orange-900 mb-4">🍽️ Dining Recommendations</h4>
                            <div className="space-y-3">
                              {day.meals.map((meal, mealIndex) => (
                                <div key={mealIndex} className="bg-white p-4 rounded-xl">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                      {meal.meal_type}
                                    </span>
                                    <span className="text-gray-400 text-xs">{meal.price_range}</span>
                                  </div>
                                  <p className="font-semibold text-gray-900">{meal.venue_name}</p>
                                  <p className="text-sm text-gray-600">{meal.cuisine_type} • {safeRenderContent(meal.description)}</p>
                                  {meal.pro_tip && (
                                    <p className="text-xs text-orange-700 mt-2">💡 {meal.pro_tip}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Day Pro Tips */}
                        {day.pro_tips && day.pro_tips.length > 0 && (
                          <div className="mt-6 p-6 bg-green-50 rounded-2xl">
                            <h4 className="font-bold text-green-900 mb-3">🎯 Insider Tips</h4>
                            <ul className="space-y-2">
                              {day.pro_tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-green-500">✓</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Budget & Walking Summary */}
                        {(day.walking_distance || day.budget_summary) && (
                          <div className="mt-4 flex flex-wrap gap-4">
                            {day.walking_distance && (
                              <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                                🚶 {day.walking_distance}
                              </div>
                            )}
                            {day.budget_summary && (
                              <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                                💰 {day.budget_summary}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!showAllDays && itinerary.dayByDay.length > 3 && (
                <motion.div 
                  className="text-center mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <button 
                    className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    onClick={() => setShowAllDays(true)}
                  >
                    Show All {itinerary.dayByDay.length} Days →
                  </button>
                </motion.div>
              )}
            </div>
          </section>

          {/* What's Included / Not Included */}
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Included */}
                <div className="bg-green-50 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                    <span className="text-3xl">✓</span> What's Included
                  </h3>
                  <ul className="space-y-3">
                    {itinerary.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-green-500 mt-1">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Included */}
                {itinerary.not_included && itinerary.not_included.length > 0 && (
                  <div className="bg-red-50 rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
                      <span className="text-3xl">✕</span> Not Included
                    </h3>
                    <ul className="space-y-3">
                      {itinerary.not_included.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <span className="text-red-400 mt-1">✕</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Hidden Gems Tab */}
      {activeTab === 'hidden-gems' && itinerary.hiddenGems && itinerary.hiddenGems.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">
              💎 Hidden Gems & Secret Spots
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Discover the places only locals know about
            </p>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              {itinerary.hiddenGems.map((gem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💎</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{gem.name}</h3>
                      <span className="text-sm text-purple-600">{gem.category}</span>
                    </div>
                  </div>
                  <div className="text-gray-700 mb-4">{safeRenderContent(gem.description)}</div>
                  <div className="space-y-2 text-sm">
                    <div className="text-purple-700"><strong>✨ Why it's special:</strong> {safeRenderContent(gem.why_special)}</div>
                    <p className="text-gray-600"><strong>⏰ Best time:</strong> {gem.best_time}</p>
                    <p className="text-green-700"><strong>🤫 Local tip:</strong> {gem.local_tip}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Neighborhoods Tab */}
      {activeTab === 'hidden-gems' && itinerary.neighborhoods && itinerary.neighborhoods.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
              🏘️ Neighborhoods to Explore
            </h2>
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {itinerary.neighborhoods.map((hood, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{hood.name}</h3>
                  <p className="text-sm text-purple-600 mb-3">{hood.vibe}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Best for:</strong> {hood.best_for}</p>
                    <p><strong>Must see:</strong> {hood.must_see}</p>
                    <p className="text-green-700">{hood.local_experience}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dining Guide Tab */}
      {activeTab === 'dining' && itinerary.diningGuide && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">
              🍜 Food & Dining Guide
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Savor the best culinary experiences
            </p>

            {/* Restaurants */}
            {itinerary.diningGuide.restaurants && itinerary.diningGuide.restaurants.length > 0 && (
              <div className="max-w-6xl mx-auto mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <span className="text-3xl">🍽️</span> Must-Try Restaurants
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {itinerary.diningGuide.restaurants.map((restaurant, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-orange-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{restaurant.name}</h4>
                          <p className="text-sm text-orange-600">{restaurant.cuisine}</p>
                        </div>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {restaurant.price_range}
                        </span>
                      </div>
                      <div className="text-gray-700 mb-3">{safeRenderContent(restaurant.description)}</div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>🍴 Try the:</strong> {restaurant.specialty_dish}
                      </p>
                      <p className="text-sm text-green-700">
                        💡 {restaurant.reservation_tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Street Food */}
            {itinerary.diningGuide.street_food && itinerary.diningGuide.street_food.length > 0 && (
              <div className="max-w-6xl mx-auto mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <span className="text-3xl">🍢</span> Street Food Adventures
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {itinerary.diningGuide.street_food.map((food, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-yellow-50 rounded-xl p-5"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">{food.name}</h4>
                      <div className="text-sm text-gray-600 mb-2">{safeRenderContent(food.description)}</div>
                      <p className="text-xs text-yellow-700">📍 {food.where_to_find}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Food Etiquette */}
            {itinerary.diningGuide.food_etiquette && itinerary.diningGuide.food_etiquette.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <span className="text-3xl">🙏</span> Dining Etiquette
                </h3>
                <div className="bg-purple-50 rounded-2xl p-8">
                  <ul className="space-y-3">
                    {itinerary.diningGuide.food_etiquette.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-purple-500">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Seasonal Events */}
      {activeTab === 'dining' && itinerary.seasonalEvents && itinerary.seasonalEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
              🎉 Seasonal Events & Festivals
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {itinerary.seasonalEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🎊</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{event.event_name}</h4>
                        <span className="text-sm text-purple-600">{event.date_range}</span>
                      </div>
                      <div className="text-gray-600 mb-2">{safeRenderContent(event.description)}</div>
                      <p className="text-sm text-green-700">💡 {event.insider_tip}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Practical Info Tab */}
      {activeTab === 'practical' && itinerary.practicalInfo && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">
              🎒 Practical Information
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Everything you need to know before you go
            </p>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Transportation */}
              {itinerary.practicalInfo.transportation && itinerary.practicalInfo.transportation.length > 0 && (
                <div className="bg-blue-50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🚃</span> Getting Around
                  </h3>
                  <div className="space-y-4">
                    {itinerary.practicalInfo.transportation.map((t, index) => (
                      <div key={index} className="bg-white rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-900">{t.mode}</h4>
                          <span className="text-sm text-blue-600">{t.cost_estimate}</span>
                        </div>
                        <p className="text-sm text-gray-600">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Money Tips */}
              {itinerary.practicalInfo.money_tips && itinerary.practicalInfo.money_tips.length > 0 && (
                <div className="bg-green-50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💰</span> Money Tips
                  </h3>
                  <ul className="space-y-3">
                    {itinerary.practicalInfo.money_tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Tips */}
              {itinerary.practicalInfo.safety_tips && itinerary.practicalInfo.safety_tips.length > 0 && (
                <div className="bg-red-50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span> Safety Tips
                  </h3>
                  <ul className="space-y-3">
                    {itinerary.practicalInfo.safety_tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-500">!</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Packing List */}
              {itinerary.practicalInfo.packing_essentials && itinerary.practicalInfo.packing_essentials.length > 0 && (
                <div className="bg-purple-50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🧳</span> Packing Essentials
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.practicalInfo.packing_essentials.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Useful Phrases */}
            {itinerary.practicalInfo.useful_phrases && itinerary.practicalInfo.useful_phrases.length > 0 && (
              <div className="max-w-4xl mx-auto mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
                  <span className="text-3xl">💬</span> Useful Phrases
                </h3>
                <div className="bg-gray-50 rounded-3xl p-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    {itinerary.practicalInfo.useful_phrases.map((phrase, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-gray-900">{phrase.phrase}</p>
                          <p className="text-sm text-gray-500">{phrase.pronunciation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-600 font-medium">{phrase.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty State for Tabs */}
      {activeTab === 'hidden-gems' && (!itinerary.hiddenGems || itinerary.hiddenGems.length === 0) && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hidden Gems Coming Soon</h2>
            <p className="text-gray-600">We're curating secret spots for this destination</p>
          </div>
        </section>
      )}

      {activeTab === 'dining' && !itinerary.diningGuide && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="text-6xl mb-4">🍜</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dining Guide Coming Soon</h2>
            <p className="text-gray-600">We're researching the best food experiences for you</p>
          </div>
        </section>
      )}

      {activeTab === 'practical' && !itinerary.practicalInfo && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="text-6xl mb-4">🎒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Practical Info Coming Soon</h2>
            <p className="text-gray-600">We're gathering essential travel tips for you</p>
          </div>
        </section>
      )}

      {/* Ask AI to Customize */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-7xl mb-6">🧞</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Want to Customize This?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let Voyyara Genie adjust this itinerary to match your preferences, add activities, or change the pace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-10 py-7 text-xl font-bold shadow-2xl"
              >
                <Link href={`/planner?destination=${itinerary.destination}&itinerary=${itinerary.type}`}>
                  🧳 Customize with AI →
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-transparent text-white hover:bg-white/10 border-2 border-white rounded-full px-10 py-7 text-xl font-bold"
              >
                <Link href={`/destinations/${itinerary.destination.toLowerCase().replace(/\s+/g, '-')}`}>
                  ← Back to {itinerary.destination}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
