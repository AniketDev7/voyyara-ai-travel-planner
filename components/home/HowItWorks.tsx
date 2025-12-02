'use client';

import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Tell us your dream',
      description: 'Share where you want to go, your budget, travel dates, and interests. Our AI understands natural conversation.',
    },
    {
      number: '02',
      title: 'Genie creates your plan',
      description: 'Our advanced AI analyzes thousands of possibilities and creates a personalized day-by-day itinerary in seconds.',
    },
    {
      number: '03',
      title: 'Refine and customize',
      description: 'Chat with AI to adjust your plan. Add activities, change destinations, or modify the pace - it\'s all flexible.',
    },
    {
      number: '04',
      title: 'Start your adventure',
      description: 'Save your itinerary, share it with friends, and embark on your perfectly planned journey with confidence.',
    },
  ];

  return (
    <section className="py-24 bg-white">
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
            How it Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Planning your perfect trip is as easy as having a conversation
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent -ml-4" />
              )}

              <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 h-full border border-purple-100 hover:shadow-xl transition-all">
                {/* Step Number and Icon on same line */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-5xl font-bold text-purple-200">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

