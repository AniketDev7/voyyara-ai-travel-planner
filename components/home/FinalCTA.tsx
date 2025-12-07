'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FinalCTAProps {
  content?: {
    icon?: string;
    title?: string;
    subtitle?: string;
    cta_primary_text?: string;
    cta_primary_link?: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
    trust_badges?: string[];
  };
}

const defaultContent = {
  icon: '🌏',
  title: 'Ready to Start Your Next Adventure?',
  subtitle: 'Let AI plan your perfect trip in seconds. No credit card required.',
  cta_primary_text: 'Start Planning Now →',
  cta_primary_link: '/planner',
  cta_secondary_text: 'Explore Destinations',
  cta_secondary_link: '/destinations',
  trust_badges: ['Free to use', 'No credit card', 'Instant results'],
};

export function FinalCTA({ content }: FinalCTAProps) {
  const data = { ...defaultContent, ...content };

  return (
    <section className="py-32 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 relative overflow-hidden">
      {/* Decorative Elements - DESIGN (stays in code) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-8xl mb-8"
          >
            {data.icon}
          </motion.div>

          {/* Heading - TEXT FROM CMS */}
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            {data.title?.split(' Your ')[0]} Your
            <br />
            {data.title?.split(' Your ')[1] || 'Next Adventure?'}
          </h2>

          {/* Description - TEXT FROM CMS */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium">
            {data.subtitle}
          </p>

          {/* CTA Buttons - TEXT FROM CMS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="text-xl px-12 py-8 bg-white text-purple-600 hover:bg-gray-100 rounded-full shadow-2xl hover:shadow-white/50 transition-all font-bold"
            >
              <Link href={data.cta_primary_link || '/planner'}>
                {data.cta_primary_text}
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="text-xl px-12 py-8 border-2 border-white bg-transparent text-white hover:bg-white hover:text-purple-600 rounded-full backdrop-blur-sm font-bold transition-all"
            >
              <Link href={data.cta_secondary_link || '/destinations'}>
                {data.cta_secondary_text}
              </Link>
            </Button>
          </div>

          {/* Trust Badges - TEXT FROM CMS */}
          {data.trust_badges && data.trust_badges.length > 0 && (
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white">
              {data.trust_badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span className="font-semibold">{badge}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
