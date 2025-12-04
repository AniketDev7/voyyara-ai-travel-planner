'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);

  // Fetch about page data on mount
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const response = await fetch('/api/about-page');
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    }
    fetchAboutData();
  }, []);

  // Fallback content if CMS is unavailable
  const pageData = aboutData || {
    hero_emoji: '🌏',
    hero_title: 'About Voyyara',
    hero_subtitle: "We're revolutionizing travel planning with AI-powered personalization",
    story_content: "Voyyara was born from a simple belief: travel planning should be exciting, not exhausting. We've all spent countless hours juggling multiple websites, reading endless reviews, and trying to piece together the perfect itinerary. We knew there had to be a better way.\n\nBy combining the power of artificial intelligence with deep travel expertise and a comprehensive content management system, we've created Voyyara Genie 🧞 - your personal AI travel assistant that understands your unique preferences and creates detailed, personalized itineraries in seconds.\n\nWhether you're planning a cultural exploration of Japan, a beach getaway in Thailand, or discovering the hidden gems of Vietnam, Voyyara makes every step of the planning process seamless and enjoyable.",
    mission_title: 'Our Mission',
    mission_description: 'To make personalized travel planning accessible to everyone through the power of AI',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-7xl mb-6">{pageData.hero_emoji || '🌏'}</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            {pageData.hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            {pageData.hero_subtitle}
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {pageData.story_content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-lg mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900">{pageData.mission_title}</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {pageData.mission_description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '✨',
                  title: 'Personalization',
                  description: 'Every traveler is unique. Voyyara Genie learns your preferences to create itineraries that truly match your style.',
                },
                {
                  icon: '🌍',
                  title: 'Accessibility',
                  description: 'World-class travel planning should be available to everyone, not just those who can afford expensive travel agents.',
                },
                {
                  icon: '🚀',
                  title: 'Innovation',
                  description: 'We leverage cutting-edge AI technology to continuously improve and deliver the best travel planning experience.',
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-white shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-6">{value.icon}</div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Powered by Advanced AI</h2>
              <p className="text-xl text-gray-700 mb-12">
                Voyyara uses OpenAI GPT-4 and sophisticated content management to deliver intelligent, 
                contextual travel recommendations that get better with every interaction.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg">
                <span className="px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-semibold">OpenAI GPT-4</span>
                <span className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-semibold">Next.js 15</span>
                <span className="px-6 py-3 bg-pink-100 text-pink-700 rounded-full font-semibold">Contentstack CMS</span>
                <span className="px-6 py-3 bg-orange-100 text-orange-700 rounded-full font-semibold">Real-time Streaming</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-7xl mb-6">🧞</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience Voyyara?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of travelers who trust Voyyara Genie to plan their perfect trips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-bold shadow-2xl">
                <Link href="/planner">
                  Start Planning →
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white hover:text-purple-600 rounded-full px-10 py-7 text-lg font-bold">
                <Link href="/destinations">
                  Explore Destinations
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
