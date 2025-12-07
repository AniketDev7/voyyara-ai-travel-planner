'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [destination, setDestination] = useState<any>(null);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch destination by slug
      const destResponse = await fetch('/api/destinations');
      const destData = await destResponse.json();
      
      if (destData.success) {
        const foundDest = destData.destinations.find((d: any) => 
          d.title.toLowerCase().replace(/\s+/g, '-') === resolvedParams.slug
        );
        
        if (foundDest) {
          setDestination(foundDest);
          
          // Fetch itineraries for this destination using title
          const itinResponse = await fetch(`/api/itineraries/${encodeURIComponent(foundDest.title)}`);
          const itinData = await itinResponse.json();
          
          if (itinData.success && itinData.itineraries && itinData.itineraries.length > 0) {
            setItineraries(itinData.itineraries);
          } else {
            // Fallback to mock data if no itineraries found
            console.log('No itineraries found, using mock data');
            setItineraries(getMockItineraries(foundDest.title));
          }
        } else {
          // Mock destination if not found
          setDestination(getMockDestination(resolvedParams.slug));
          setItineraries(getMockItineraries(resolvedParams.slug));
        }
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [resolvedParams.slug]);

  function getMockDestination(slug: string) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: title,
      hero_image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920',
      description: 'Experience the perfect blend of ancient traditions and modern culture in this incredible destination.',
      long_description: 'From bustling cities to serene landscapes, this destination offers an unforgettable journey through history, culture, and natural beauty. Whether you\'re seeking adventure, relaxation, or cultural immersion, you\'ll find it all here.',
      best_time: 'November to April',
      duration: '7-14 days recommended',
      currency: 'Local Currency',
      language: 'Local Language',
      highlights: [
        { icon: '🏛️', title: 'Historical Sites', description: 'Ancient temples and monuments' },
        { icon: '🍜', title: 'Amazing Food', description: 'Culinary adventures await' },
        { icon: '🏖️', title: 'Beautiful Beaches', description: 'Pristine coastal paradise' },
        { icon: '🎭', title: 'Rich Culture', description: 'Vibrant traditions and festivals' },
      ],
      included: [
        { icon: '👥', title: 'Expert Guides', description: 'Local guides who know everything' },
        { icon: '✈️', title: 'All Transfers', description: 'Airport and city transportation' },
        { icon: '🏨', title: 'Accommodation', description: 'Comfortable hotels included' },
        { icon: '🍽️', title: 'Some Meals', description: 'Breakfast included daily' },
      ],
    };
  }

  function getMockItineraries(title: string) {
    // Minimal fallback - in production, all data should come from Contentstack CMS
    return [
      {
        slug: `${title.toLowerCase().replace(/\s+/g, '-')}-contact-us`,
        title: 'Itineraries Coming Soon',
        type: 'custom',
        duration: { days: 7, nights: 6, display_text: '7 Days / 6 Nights' },
        short_description: 'Our travel experts are preparing amazing itineraries for this destination.',
        thumbnail_image: { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800' },
        highlights: [
          { title: 'Contact us for details' },
          { title: 'Custom planning available' },
        ],
        pricing: { display_price: 'Contact for pricing' },
      },
    ];
  }

  // Helper to format duration from V2 format
  function formatDuration(duration: any): string {
    if (!duration) return '7 Days';
    if (typeof duration === 'string') return duration;
    if (duration.display_text) return duration.display_text;
    if (duration.nights && duration.days) return `${duration.nights} Nights / ${duration.days} Days`;
    if (duration.days) return `${duration.days} Days`;
    return '7 Days';
  }

  // Helper to get price from V2 format
  function getPrice(itinerary: any): string {
    if (itinerary.pricing?.display_price) return itinerary.pricing.display_price;
    if (itinerary.pricing?.price_display) return itinerary.pricing.price_display;
    if (itinerary.pricing?.base_price) return `From $${itinerary.pricing.base_price}`;
    if (itinerary.price) return itinerary.price;
    return 'Contact for price';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-airplane">✈️</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Destination not found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find this destination.</p>
          <Button asChild>
            <Link href="/destinations">View All Destinations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image - from CMS featured_image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination?.featured_image?.url || destination?.hero_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            {destination.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            {destination.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              asChild
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-bold shadow-2xl"
            >
              <Link href={`/planner?destination=${destination.title}`}>
                Plan Your Trip with AI →
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Quick Info Cards */}
        <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { icon: '📅', title: 'Best Time', value: destination.best_time_to_visit || destination.best_time || 'Year-round' },
                { icon: '⏱️', title: 'Recommended', value: '7-14 days' },
                { icon: '💰', title: 'Currency', value: destination.currency || 'Local Currency' },
                { icon: '🗣️', title: 'Language', value: destination.language || 'English' },
              ].map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{info.icon}</div>
                      <div className="text-sm text-gray-500 font-medium mb-1">{info.title}</div>
                      <div className="text-sm font-bold text-gray-900">{info.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About the Destination */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">About the Destination</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {destination.long_description || destination.description || 'Discover the beauty and culture of this amazing destination.'}
            </p>
          </div>

          {/* Highlights Grid */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {destination.highlights.map((highlight: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100 rounded-3xl hover:shadow-xl transition-all">
                    <CardContent className="p-8 text-center">
                      <div className="text-5xl mb-4">{highlight.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{highlight.title}</h3>
                      <p className="text-gray-600">{highlight.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Itineraries */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6 text-center text-gray-900">Popular Itineraries</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Choose from our curated travel packages or ask our AI to create a custom plan just for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {itineraries.map((itinerary: any, index: number) => (
              <motion.div
                key={itinerary.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/itinerary/${itinerary.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl h-full">
                    {/* Image */}
                    <div className="h-56 overflow-hidden relative">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${itinerary.thumbnail_image?.url || itinerary.hero_image?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'})` }}
                      />
                      <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full font-bold text-gray-900 shadow-lg">
                        {formatDuration(itinerary.duration)}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                        {itinerary.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{itinerary.short_description}</p>

                      {/* Highlights */}
                      <div className="space-y-2 mb-4">
                        {itinerary.highlights?.slice(0, 3).map((highlight: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-purple-500">✓</span>
                            <span>{highlight.highlight_title || highlight.title || highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">{getPrice(itinerary)}</span>
                          <span className="text-sm text-gray-500">per person</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Ask AI Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200 rounded-3xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-6">🧞</div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Want Something Different?</h3>
                <p className="text-xl text-gray-700 mb-8">
                  Let Voyyara Genie create a personalized itinerary based on your unique preferences, budget, and travel style.
                </p>
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-10 py-7 text-lg font-bold shadow-xl"
                >
                  <Link href={`/planner?destination=${destination.title}`}>
                    🧳 Ask AI to Customize →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      {destination.included && destination.included.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold mb-16 text-center text-gray-900">What&apos;s Included</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {destination.included.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 rounded-3xl hover:shadow-xl transition-all h-full">
                    <CardContent className="p-8">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to explore {destination.title}?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let our AI create a personalized itinerary just for you
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-12 py-7 text-xl font-bold shadow-2xl"
            >
              <Link href={`/planner?destination=${destination.title}`}>
                Start Planning with AI →
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

