'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PersonalizationInfo {
  currency: string;
  language: string;
  variantApplied: boolean;
  variantUid: string | null;
  variantName: string | null;
}

export default function ItineraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllDays, setShowAllDays] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [personalization, setPersonalization] = useState<PersonalizationInfo | null>(null);

  const fetchItinerary = useCallback(async (currency: string) => {
    try {
      // Fetch from Contentstack with currency preference
      const language = localStorage.getItem('voyyara_language') || 'en';
      const response = await fetch(`/api/itinerary/${resolvedParams.slug}?currency=${currency}&language=${language}`);
      const data = await response.json();
      
      if (data.success && data.itinerary) {
        // Store personalization info
        if (data.personalization) {
          setPersonalization(data.personalization);
        }
        
        // Transform Contentstack data to component format
        const cms = data.itinerary;
        const transformed = {
          destination: cms.destination?.[0]?.title || cms.destination || 'Destination',
          type: cms.type,
          name: cms.title,
          duration: cms.duration,
          heroImage: cms.hero_image_url || cms.hero_image?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920',
          description: cms.short_description,
          longDescription: cms.long_description,
          price: cms.price,
          included: cms.included_items || [],
          highlights: cms.highlights || [],
          dayByDay: cms.day_by_day?.map((day: any) => ({
            day: `Day ${day.day_number}`,
            title: day.day_title,
            image: day.day_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
            activities: day.activities?.map((act: any) => ({
              time: act.time,
              title: act.activity_title,
              description: act.activity_description,
            })) || [],
          })) || [],
        };
        setItinerary(transformed);
      } else {
        // Fallback to mock data only if fetch fails
        setItinerary(getMockItinerary(resolvedParams.slug));
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setItinerary(getMockItinerary(resolvedParams.slug));
    }
    
    setLoading(false);
  }, [resolvedParams.slug]);

  useEffect(() => {
    // Get initial currency from localStorage
    const savedCurrency = localStorage.getItem('voyyara_currency') || 'USD';
    setCurrentCurrency(savedCurrency);
    fetchItinerary(savedCurrency);
    
    // Listen for currency changes from LocalizationSwitcher
    const handleCurrencyChange = (event: CustomEvent) => {
      const newCurrency = event.detail?.code || 'USD';
      setCurrentCurrency(newCurrency);
      fetchItinerary(newCurrency);
    };
    
    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      const savedCurrency = localStorage.getItem('voyyara_currency') || 'USD';
      fetchItinerary(savedCurrency);
    };
    
    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, [fetchItinerary]);

  // Minimal fallback for error cases only - all real data should come from Contentstack CMS
  function getMockItinerary(slug: string) {
    const parts = slug.split('-');
    const destination = parts.slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
      destination,
      type: 'custom',
      name: 'Itinerary Currently Unavailable',
      duration: '7N 8D',
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920',
      description: 'This itinerary is being updated in our CMS. Please check back soon or contact us for details.',
      longDescription: 'Our travel experts are working on providing you with detailed itinerary information. In the meantime, feel free to use our AI planner to create a custom itinerary.',
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-airplane">✈️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${itinerary.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30">
                {itinerary.duration}
              </span>
              <span className="px-4 py-2 bg-purple-600 rounded-full text-white font-semibold">
                {itinerary.destination}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {itinerary.name}
            </h1>
            <p className="text-2xl text-white/90 mb-6 max-w-3xl">
              {itinerary.description}
            </p>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm text-white/70">Starting from</div>
                <div className="text-4xl font-bold text-white">{itinerary.price}</div>
                <div className="text-sm text-white/70">per person</div>
                {/* Personalization indicator */}
                {personalization?.variantApplied && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/80 rounded-full text-xs text-white font-medium">
                      ✨ Personalized ({personalization.variantName})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {itinerary.highlights.map((highlight: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{highlight.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{highlight.title}</div>
                <div className="text-sm text-gray-600">{highlight.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Day by Day Itinerary */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-4 text-center text-gray-900">Day-by-Day Itinerary</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Every moment planned for an unforgettable experience
          </p>

          <div className="max-w-6xl mx-auto space-y-16">
            {(showAllDays ? itinerary.dayByDay : itinerary.dayByDay.slice(0, 3)).map((day: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Image Side */}
                  <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      <div
                        className="h-80 bg-cover bg-center"
                        style={{ backgroundImage: `url(${day.image})` }}
                      />
                      <div className="absolute top-6 left-6 bg-white px-6 py-3 rounded-full shadow-lg">
                        <span className="text-2xl font-bold text-gray-900">{day.day}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">{day.title}</h3>
                    <div className="space-y-4">
                      {day.activities.map((activity: any, actIndex: number) => (
                        <Card key={actIndex} className="border-l-4 border-purple-500 rounded-xl hover:shadow-lg transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="min-w-[90px] px-4 py-3 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                  <span className="text-xs font-bold text-purple-700 whitespace-nowrap">{activity.time}</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 mb-1">{activity.title}</h4>
                                <p className="text-gray-600">{activity.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show more days indicator */}
          {!showAllDays && itinerary.dayByDay.length > 3 && (
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button 
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-full text-purple-700 font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105"
                onClick={() => setShowAllDays(true)}
              >
                + {itinerary.dayByDay.length - 3} more amazing days...
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">What&apos;s Included</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {itinerary.included.map((item: string, index: number) => (
              <div key={index} className="px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask AI to Customize */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-7xl mb-6">🧞</div>
            <h2 className="text-5xl font-bold text-white mb-6">Want to Customize This?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let Voyyara Genie adjust this itinerary to match your preferences, add activities, or change the pace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-10 py-7 text-xl font-bold shadow-2xl"
              >
                <Link href={`/planner?destination=${itinerary.destination?.[0]?.title || itinerary.destination}&itinerary=${itinerary.type}`}>
                  🧳 Customize with AI →
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-white text-purple-600 hover:bg-gray-100 border-2 border-white rounded-full px-10 py-7 text-xl font-bold shadow-2xl"
              >
                <Link href={`/destinations/${(itinerary.destination?.[0]?.title || itinerary.destination).toLowerCase().replace(/\s+/g, '-')}`}>
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

