'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePreferences } from '@/hooks/usePreferences';
import { usePersonalizedItineraries } from '@/hooks/usePersonalizedItineraries';
import PersonalizedBadge from '@/components/shared/PersonalizedBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

export default function PersonalizedForYou() {
  const { hasCompletedQuiz, preferences, getPreferenceLabel } = usePreferences();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch itineraries
  useEffect(() => {
    async function fetchItineraries() {
      try {
        const response = await fetch('/api/itineraries');
        if (response.ok) {
          const data = await response.json();
          setItineraries(data.itineraries || []);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
      setLoading(false);
    }
    
    fetchItineraries();
  }, []);

  const { topRecommendations, youMightLike } = usePersonalizedItineraries(itineraries);

  // Don't show if user hasn't taken the quiz
  if (!hasCompletedQuiz) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const hasRecommendations = topRecommendations.length > 0;

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium mb-4">
            <span className="text-lg">✨</span>
            <span>Personalized for you</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Trips</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your preferences: {getPreferenceLabel('travel_style')} travel, 
            {preferences?.interests && Array.isArray(preferences.interests) 
              ? ` interested in ${preferences.interests.slice(0, 2).join(' & ')}`
              : ''
            }
          </p>
        </motion.div>

        {hasRecommendations ? (
          <>
            {/* Top Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topRecommendations.slice(0, 6).map((itin, index) => (
                <motion.div
                  key={itin.uid}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/itinerary/${itin.slug}`}>
                    <Card className="group overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                          style={{
                            backgroundImage: `url(${itin.hero_image?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Match Badge */}
                        <div className="absolute top-4 right-4">
                          <PersonalizedBadge 
                            matchScore={itin.matchScore} 
                            compact 
                          />
                        </div>
                        
                        {/* Destination */}
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                            {itin.destination?.[0]?.title || 'Destination'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {itin.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {itin.short_description}
                        </p>

                        {/* Match Reasons */}
                        {itin.matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {itin.matchReasons.slice(0, 2).map((reason, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                              >
                                <span>✓</span>
                                {reason}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs text-gray-500">
                              {typeof itin.duration === 'object' 
                                ? itin.duration.display_text 
                                : itin.duration}
                            </div>
                            <div className="font-bold text-purple-600">{itin.price}</div>
                          </div>
                          <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                            View →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-full text-lg"
              >
                <Link href="/destinations">
                  Explore All Destinations →
                </Link>
              </Button>
            </motion.div>
          </>
        ) : (
          // No matches - show explore CTA
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              We're finding your perfect trips...
            </h3>
            <p className="text-gray-600 mb-8">
              Explore our destinations and we'll learn more about what you love!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Link href="/destinations">
                Browse Destinations
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

