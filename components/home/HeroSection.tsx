'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Design stays in code - only text content comes from CMS
const floatTransition1 = {
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut" as const
};

const floatTransition2 = {
  duration: 7,
  repeat: Infinity,
  ease: "easeInOut" as const
};

const floatTransition3 = {
  duration: 5.5,
  repeat: Infinity,
  ease: "easeInOut" as const
};

// Props interface for CMS content
interface HeroSectionProps {
  content?: {
    tagline?: string;
    title_line1?: string;
    title_highlight?: string;
    description?: string;
    cta_primary_text?: string;
    cta_primary_link?: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
  };
}

// Default content (fallback if CMS unavailable)
const defaultContent = {
  tagline: 'AI-POWERED TRAVEL',
  title_line1: 'Travel differently.',
  title_highlight: 'with AI',
  description: 'Get personalized travel itineraries in seconds. Our AI planner creates detailed, day-by-day plans tailored to your preferences and budget.',
  cta_primary_text: '🌏 Start Planning',
  cta_primary_link: '/planner',
  cta_secondary_text: '✨ Explore Destinations',
  cta_secondary_link: '/destinations',
};

export function HeroSection({ content }: HeroSectionProps) {
  // Merge CMS content with defaults
  const data = { ...defaultContent, ...content };

  return (
    <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100">
      {/* Gradient Overlay - DESIGN (stays in code) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-transparent to-orange-200/30 rounded-b-[2.5rem]" />
      
      {/* Floating Landmarks - DESIGN (stays in code) */}
      <motion.div
        className="absolute top-[8%] right-[-5vw] md:right-[4vw] w-[35%] max-w-[220px] md:top-[17%]"
        animate={{ y: [0, -25, 0] }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ ...floatTransition2, delay: 0.3 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=500&fit=crop"
          alt="Eiffel Tower"
          width={220}
          height={261}
          className="drop-shadow-2xl"
        />
      </motion.div>

      <motion.div
        className="absolute right-0 bottom-[3.5%] md:top-[66%] md:right-[6vw] w-[35%] max-w-[220px]"
        animate={{ y: [0, -15, 0] }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ ...floatTransition3, delay: 0.5 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=350&fit=crop"
          alt="Ancient Architecture"
          width={220}
          height={191}
          className="drop-shadow-2xl rounded-2xl"
        />
      </motion.div>

      <motion.div
        className="hidden xl:block absolute top-[27%] right-[25vw]"
        animate={{ y: [0, -20, 0] }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ ...floatTransition1, delay: 0.4 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=450&fit=crop"
          alt="Travel Destination"
          width={246}
          height={282}
          className="drop-shadow-2xl rounded-2xl"
        />
      </motion.div>

      <motion.div
        className="hidden md:block absolute bottom-[5%] left-[5vw] opacity-80"
        animate={{ y: [0, -25, 0] }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.8, scale: 1 }}
        transition={{ ...floatTransition2, delay: 0.6 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=350&h=400&fit=crop"
          alt="Mountain Landscape"
          width={217}
          height={250}
          className="drop-shadow-2xl rounded-2xl"
        />
      </motion.div>

      {/* Decorative Icons - DESIGN (stays in code) */}
      <motion.div
        className="absolute -top-3 -left-2 sm:top-2 sm:-left-12 w-20 h-24 opacity-90"
        animate={{ rotate: [0, 10, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-6xl">📍</div>
      </motion.div>

      <motion.div
        className="absolute right-0 -bottom-14 sm:-right-8 w-24 h-22 opacity-90"
        animate={{ rotate: [0, -10, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-7xl">🧳</div>
      </motion.div>

      {/* Content - TEXT FROM CMS */}
      <div className="relative container mx-auto px-6 py-24 md:py-32 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-4 text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {data.tagline}
          </motion.div>

          <motion.div
            className="mx-auto mb-6 h-[3px] w-6 rounded-full bg-gray-800"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-gray-900 max-w-[11em] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {data.title_line1}
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              {data.title_highlight}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {data.description}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button 
              size="lg" 
              asChild 
              className="text-lg px-10 py-7 bg-black text-white hover:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              <Link href={data.cta_primary_link || '/planner'}>
                {data.cta_primary_text}
              </Link>
            </Button>
            <Button 
              size="lg" 
              asChild 
              className="text-lg px-10 py-7 bg-black text-white hover:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              <Link href={data.cta_secondary_link || '/destinations'}>
                {data.cta_secondary_text}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - DESIGN (stays in code) */}
      <motion.div 
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <button className="text-xs font-medium flex items-center gap-2 hover:opacity-60 transition-opacity">
          Learn more
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl"
          >
            ↓
          </motion.span>
        </button>
      </motion.div>
    </section>
  );
}
