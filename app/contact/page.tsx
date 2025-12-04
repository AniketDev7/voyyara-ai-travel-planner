'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Client component that fetches contact data
export default function ContactPage() {
  const [contactData, setContactData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Fetch contact page data on mount
  useEffect(() => {
    async function fetchContactData() {
      try {
        const response = await fetch('/api/contact-page');
        if (response.ok) {
          const data = await response.json();
          setContactData(data);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    }
    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Fallback content
  const pageData = contactData || {
    hero_emoji: '💬',
    hero_title: 'Get in Touch',
    hero_subtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    email: 'hello@voyyara.com',
    email_description: "We'll respond within 24 hours",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-7xl mb-6">{pageData.hero_emoji}</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            {pageData.hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            {pageData.hero_subtitle}
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="py-16 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Send us a Message</h2>
                  
                  {submitted ? (
                    <div className="py-12 text-center">
                      <div className="text-6xl mb-4">✅</div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                      <p className="text-gray-600">We&apos;ll get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="What's this about?"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us more..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Other Ways to Reach Us</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">📧</div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">Email Us</h3>
                          <a
                            href={`mailto:${pageData.email}`}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-lg"
                          >
                            {pageData.email}
                          </a>
                          <p className="text-gray-600 mt-1 text-sm">{pageData.email_description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Chat */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">💬</div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">Live Chat</h3>
                          <Button
                            variant="outline"
                            className="mt-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                          >
                            Start Chat with Voyyara Genie
                          </Button>
                          <p className="text-gray-600 mt-2 text-sm">Available 24/7</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">🌐</div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">Social Media</h3>
                          <p className="text-gray-600 mb-3">Follow us for travel inspiration</p>
                          <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="rounded-full">
                              Twitter
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full">
                              Instagram
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full">
                              Facebook
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Looking for Quick Answers?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Check out our FAQ section or chat with Voyyara Genie for instant help
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-10">
              <Link href="/planner">
                Chat with Voyyara Genie →
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
