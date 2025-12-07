'use client';

import { motion } from 'framer-motion';

interface WhyChooseUsProps {
  content?: {
    title?: string;
    subtitle?: string;
    features?: Array<{
      icon?: string;
      feature_title: string;
      feature_description: string;
    }>;
  };
}

// Design colors - stay in code
const featureColors = [
  { color: 'from-purple-100 to-pink-100', borderColor: 'border-purple-200' },
  { color: 'from-blue-100 to-cyan-100', borderColor: 'border-blue-200' },
  { color: 'from-green-100 to-emerald-100', borderColor: 'border-green-200' },
  { color: 'from-orange-100 to-amber-100', borderColor: 'border-orange-200' },
  { color: 'from-pink-100 to-rose-100', borderColor: 'border-pink-200' },
  { color: 'from-indigo-100 to-purple-100', borderColor: 'border-indigo-200' },
];

const defaultContent = {
  title: 'Why Choose Voyyara?',
  subtitle: 'We combine cutting-edge AI technology with travel expertise to give you the best planning experience',
  features: [
    { icon: '🎨', feature_title: 'Personalized Itineraries', feature_description: 'Every trip is unique, just like you. Our AI learns your preferences and creates custom plans that match your travel style.' },
    { icon: '⚡', feature_title: 'Lightning Fast', feature_description: 'No more hours of research. Get a complete travel plan in under 30 seconds with all the details you need.' },
    { icon: '💰', feature_title: 'Budget-Friendly', feature_description: 'Set your budget and let AI optimize your trip. Get the most value from every dollar spent on your adventure.' },
    { icon: '🗺️', feature_title: 'Local Insights', feature_description: 'Access insider tips and hidden gems that guidebooks miss. Experience destinations like a local, not a tourist.' },
    { icon: '📱', feature_title: 'Always Accessible', feature_description: 'Your itinerary is always at your fingertips. Access it anytime, anywhere, even offline during your travels.' },
    { icon: '🔄', feature_title: 'Flexible Plans', feature_description: 'Change your mind? No problem. Easily modify your itinerary on the fly with instant AI replanning.' },
  ],
};

export function WhyChooseUs({ content }: WhyChooseUsProps) {
  const data = {
    title: content?.title || defaultContent.title,
    subtitle: content?.subtitle || defaultContent.subtitle,
    features: content?.features || defaultContent.features,
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
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
            {data.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.features.map((feature, index) => {
            const colors = featureColors[index % featureColors.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${colors.color} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border ${colors.borderColor}`}
              >
                {/* Icon */}
                <div className="text-6xl mb-6">{feature.icon}</div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.feature_title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.feature_description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
