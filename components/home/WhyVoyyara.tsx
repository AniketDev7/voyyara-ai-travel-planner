'use client';

import { motion } from 'framer-motion';

export function WhyVoyyara() {
  const features = [
    {
      icon: '✨',
      title: 'Tailor-made',
      description: 'Ask Voyyara Genie to create a personalized itinerary tailored to your preferences and travel style. Discover the ultimate travel experience with customized plans that cater to your unique interests, ensuring every moment of your journey is memorable.',
    },
    {
      icon: '💰',
      title: 'Budget-Friendly',
      description: 'Voyyara helps you find the best value destinations and activities, optimizing your travel budget. With expert guidance, explore a range of options from affordable experiences to premium stays, ensuring your journey is both enjoyable and economical.',
    },
    {
      icon: '🗺️',
      title: 'Hidden Gems',
      description: 'Voyyara uncovers hidden gems and off-the-beaten-path destinations, ensuring you experience the authentic soul of every place. Discover unique attractions and local secrets often overlooked by mainstream tourists, from charming villages to breathtaking landscapes.',
    },
    {
      icon: '🎯',
      title: 'No Surprises',
      description: 'Voyyara ensures your trip is well-planned and stress-free with detailed day-by-day itineraries. From activities to timings, every detail is thoughtfully arranged. With Voyyara, you can focus on creating unforgettable memories while we handle the planning.',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30">
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
            Voyyara Genie is with you <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              every step of the way
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From inspiration to booking, your AI travel companion makes planning effortless
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-purple-200">
                {/* Icon */}
                <div className="text-6xl mb-6">{feature.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="/planner"
            className="inline-block bg-black hover:bg-gray-800 text-white px-10 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Planning with AI →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

