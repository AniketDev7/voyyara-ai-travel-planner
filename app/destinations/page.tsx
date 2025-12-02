'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Destination } from '@/lib/contentstack/types';

// Floating animations for background images - Faster and more visible
const floatAnimation1 = {
  y: ["0%", "12%", "0%"],
  transition: {
    duration: 4,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

const floatAnimation2 = {
  y: ["0%", "-12%", "0%"],
  transition: {
    duration: 5,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

const floatAnimation3 = {
  y: ["0%", "15%", "0%"],
  transition: {
    duration: 4.5,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

const floatAnimation4 = {
  y: ["0%", "-10%", "0%"],
  transition: {
    duration: 6,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

const floatAnimation5 = {
  y: ["0%", "8%", "0%"],
  transition: {
    duration: 5.5,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations');
        const data = await response.json();
        
        if (data.success) {
          setDestinations(data.destinations);
        } else {
          setError('Failed to load destinations');
        }
      } catch (err) {
        setError('Error loading destinations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 min-h-screen">
        <div className="text-center py-20">
          <div className="text-4xl animate-airplane">✈️</div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 min-h-screen">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4 text-lg font-semibold">{error}</p>
          <p className="text-gray-600 mb-8">
            Make sure you&apos;ve set up your Contentstack credentials and populated sample data.
          </p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6">
            <Link href="/planner">Start Planning →</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 min-h-screen">
        <div className="text-center py-20">
          <div className="text-8xl mb-6">🌍</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">No Destinations Yet</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Run the setup script to populate sample destinations:
            <br />
            <code className="bg-purple-100 px-4 py-2 rounded-lg mt-3 inline-block text-purple-700 border border-purple-200 font-mono">
              npm run add-asian
            </code>
          </p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6">
            <Link href="/planner">Try Voyyara Genie →</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-250 to-pink-100">
        {/* Floating Travel Images - Distributed everywhere */}
        {/* Top Left */}
        <motion.div
          className="absolute top-[8%] left-[3%] w-[240px] h-[300px] hidden lg:block opacity-90"
          animate={floatAnimation1}
        >
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=600&fit=crop"
            alt="Beach Paradise"
            width={240}
            height={300}
            className="rounded-3xl shadow-2xl ring-4 ring-white/50"
          />
        </motion.div>

        {/* Top Right */}
        <motion.div
          className="absolute top-[12%] right-[5%] w-[220px] h-[280px] hidden lg:block opacity-90"
          animate={floatAnimation3}
        >
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=700&fit=crop"
            alt="City Exploration"
            width={220}
            height={280}
            className="rounded-3xl shadow-2xl ring-4 ring-white/50"
          />
        </motion.div>

        {/* Middle Left */}
        <motion.div
          className="absolute top-[45%] left-[2%] w-[200px] h-[250px] hidden xl:block opacity-85"
          animate={floatAnimation4}
        >
          <Image
            src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=500&h=600&fit=crop"
            alt="Travel Adventure"
            width={200}
            height={250}
            className="rounded-3xl shadow-2xl ring-4 ring-white/50"
          />
        </motion.div>

        {/* Middle Right */}
        <motion.div
          className="absolute top-[50%] right-[4%] w-[210px] h-[260px] hidden xl:block opacity-85"
          animate={floatAnimation5}
        >
          <Image
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=500&h=600&fit=crop"
            alt="Wanderlust"
            width={210}
            height={260}
            className="rounded-3xl shadow-2xl ring-4 ring-white/50"
          />
        </motion.div>

        {/* Bottom Left */}
        <motion.div
          className="absolute bottom-[8%] left-[5%] w-[230px] h-[290px] hidden lg:block opacity-90"
          animate={floatAnimation2}
        >
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop"
            alt="Mountain Adventure"
            width={230}
            height={290}
            className="rounded-3xl shadow-2xl ring-4 ring-white/50"
          />
        </motion.div>

        {/* Bottom Right */}
        <motion.div
          className="absolute bottom-[10%] right-[6%] w-[200px] h-[240px] hidden lg:block opacity-90"
          animate={floatAnimation1}
        >
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&h=600&fit=crop"
            alt="Travel Moments"
            width={200}
            height={240}
            className="rounded-3xl shadow-2xl ring-4 ring-white/50"
          />
        </motion.div>

        {/* Decorative Icons - Distributed */}
        <motion.div
          className="absolute top-[5%] left-[28%] text-7xl hidden md:block opacity-75 drop-shadow-lg"
          animate={{ rotate: [0, 360], transition: { duration: 15, ease: "linear", repeat: Infinity } }}
        >
          🌴
        </motion.div>
        <motion.div
          className="absolute top-[40%] right-[48%] text-6xl hidden md:block opacity-70 drop-shadow-lg"
          animate={{ rotate: [0, 360], transition: { duration: 18, ease: "linear", repeat: Infinity } }}
        >
          ✈️
        </motion.div>
        <motion.div
          className="absolute bottom-[5%] right-[35%] text-7xl hidden md:block opacity-75 drop-shadow-lg"
          animate={{ rotate: [0, 360], transition: { duration: 15, ease: "linear", repeat: Infinity } }}
        >
          🏖️
        </motion.div>
      </div>

      {/* Content - relative z-10 to appear above background */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Explore Destinations
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Discover amazing places around the world and let our AI create the perfect itinerary for you
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {destinations.map((destination, index) => {
            const gradients = [
              'from-purple-100 to-pink-100',
              'from-blue-100 to-cyan-100',
              'from-orange-100 to-yellow-100',
              'from-green-100 to-teal-100',
              'from-pink-100 to-rose-100',
              'from-indigo-100 to-purple-100',
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <motion.div
                key={destination.uid}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${gradient} rounded-3xl`}>
                {destination.featured_image && (
                  <div className="h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={destination.featured_image.url}
                      alt={destination.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-gray-900">{destination.title}</CardTitle>
                  <CardDescription className="text-gray-700 text-base">{destination.short_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700 mb-5">
                    {destination.best_time_to_visit && (
                      <p className="flex items-center">
                        <span className="mr-2">🌤️</span>
                        <span className="font-medium">Best time:</span>
                        <span className="ml-1">{destination.best_time_to_visit}</span>
                      </p>
                    )}
                    {destination.currency && (
                      <p className="flex items-center">
                        <span className="mr-2">💰</span>
                        <span className="font-medium">Currency:</span>
                        <span className="ml-1">{destination.currency}</span>
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6 text-base font-semibold shadow-lg" asChild>
                      <Link href={`/destinations/${destination.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Details →
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full rounded-full py-6 text-base font-semibold border-2" asChild>
                      <Link href={`/planner?destination=${encodeURIComponent(destination.title)}`}>
                        Plan with AI
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section - Smaller and centered */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 mx-auto max-w-2xl text-center bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-3xl p-12 shadow-xl border border-orange-200"
        >
          <div className="text-6xl mb-5">🧞</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ready to Plan Your Trip?</h2>
          <p className="text-lg text-gray-700 mb-6 font-medium">
            Let Voyyara Genie create a personalized itinerary for any destination
          </p>
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl" asChild>
            <Link href="/planner">
              Chat with Voyyara Genie →
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

