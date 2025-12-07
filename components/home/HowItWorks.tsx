'use client';

import { motion } from 'framer-motion';

interface HowItWorksProps {
  content?: {
    title?: string;
    subtitle?: string;
    steps?: Array<{
      number?: string;
      step_title: string;
      step_description: string;
    }>;
  };
}

const defaultContent = {
  title: 'How it Works',
  subtitle: 'Planning your perfect trip is as easy as having a conversation',
  steps: [
    {
      number: '01',
      step_title: 'Tell us your dream',
      step_description: 'Share where you want to go, your budget, travel dates, and interests. Our AI understands natural conversation.',
    },
    {
      number: '02',
      step_title: 'Genie creates your plan',
      step_description: 'Our advanced AI analyzes thousands of possibilities and creates a personalized day-by-day itinerary in seconds.',
    },
    {
      number: '03',
      step_title: 'Refine and customize',
      step_description: "Chat with AI to adjust your plan. Add activities, change destinations, or modify the pace - it's all flexible.",
    },
    {
      number: '04',
      step_title: 'Start your adventure',
      step_description: 'Save your itinerary, share it with friends, and embark on your perfectly planned journey with confidence.',
    },
  ],
};

export function HowItWorks({ content }: HowItWorksProps) {
  const data = {
    title: content?.title || defaultContent.title,
    subtitle: content?.subtitle || defaultContent.subtitle,
    steps: content?.steps || defaultContent.steps,
  };

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
            {data.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {data.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connecting Line */}
              {index < data.steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent -ml-4" />
              )}

              <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 h-full border border-purple-100 hover:shadow-xl transition-all">
                {/* Step Number */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-5xl font-bold text-purple-200">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {step.step_title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.step_description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
