'use client';

import { motion } from 'framer-motion';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      avatar: '👩‍💼',
      rating: 5,
      text: 'Voyyara planned my entire 2-week trip to Vietnam in minutes! Every recommendation was spot-on. Best travel tool I\'ve ever used.',
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      avatar: '👨‍💻',
      rating: 5,
      text: 'The AI understood exactly what I wanted - a mix of culture and adventure. Saved me hours of research and the trip was incredible!',
    },
    {
      name: 'Emma Rodriguez',
      location: 'Barcelona, Spain',
      avatar: '👩‍🎨',
      rating: 5,
      text: 'I was skeptical about AI planning, but Voyyara exceeded all expectations. It found hidden gems I would never have discovered on my own.',
    },
    {
      name: 'David Kim',
      location: 'Seoul, South Korea',
      avatar: '👨‍🔬',
      rating: 5,
      text: 'Perfect for solo travelers! The itinerary was safe, budget-friendly, and packed with amazing experiences. Highly recommended!',
    },
    {
      name: 'Lisa Anderson',
      location: 'London, UK',
      avatar: '👩‍🏫',
      rating: 5,
      text: 'Planning family trips used to be so stressful. Voyyara made it easy and fun. The kids loved every activity it suggested!',
    },
    {
      name: 'James Wright',
      location: 'Toronto, Canada',
      avatar: '👨‍✈️',
      rating: 5,
      text: 'As a frequent traveler, I\'ve tried many planning tools. Voyyara is hands-down the best. The AI is incredibly smart and intuitive.',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Loved by Travelers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy travelers who have discovered their perfect trips with Voyyara
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { number: '10K+', label: 'Happy Travelers' },
            { number: '50K+', label: 'Trips Planned' },
            { number: '100+', label: 'Destinations' },
            { number: '4.9/5', label: 'Average Rating' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

