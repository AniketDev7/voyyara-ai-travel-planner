'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FeaturedDestinations() {
  const destinations = [
    {
      name: 'Vietnam',
      image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800',
      description: 'Ancient temples, bustling cities, and stunning coastlines',
      gradient: 'from-emerald-500/80 to-teal-500/80',
      highlights: ['Ha Long Bay', 'Hanoi', 'Ho Chi Minh City'],
    },
    {
      name: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      description: 'Blend of ancient tradition and cutting-edge modernity',
      gradient: 'from-pink-500/80 to-rose-500/80',
      highlights: ['Tokyo', 'Kyoto', 'Mount Fuji'],
    },
    {
      name: 'Thailand',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
      description: 'Tropical beaches, vibrant culture, and delicious cuisine',
      gradient: 'from-orange-500/80 to-amber-500/80',
      highlights: ['Bangkok', 'Phuket', 'Chiang Mai'],
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our most loved travel destinations and let AI plan your perfect trip
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {destinations.map((destination, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${destination.image})` }}
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${destination.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <h3 className="text-4xl font-bold mb-3">{destination.name}</h3>
                <p className="text-lg mb-4 opacity-90">{destination.description}</p>
                
                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {destination.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <Button
                  asChild
                  className="bg-white text-gray-900 hover:bg-gray-100 rounded-full w-full font-semibold"
                >
                  <Link href={`/planner?destination=${destination.name}`}>
                    Plan Your Trip →
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-full px-10 py-6 text-lg border-2 border-gray-300 hover:border-gray-400"
          >
            <Link href="/destinations">
              View All Destinations →
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

