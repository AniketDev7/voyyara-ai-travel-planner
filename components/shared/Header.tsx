'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LocalizationSwitcher } from './LocalizationSwitcher';
import { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  url: string;
  new_tab?: boolean;
}

interface SiteSettings {
  branding?: {
    site_name?: string;
    logo_icon?: string;
  };
  main_nav?: NavItem[];
  header_ctas?: {
    sign_in_text?: string;
    sign_in_link?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
  };
}

// Default settings (fallback)
const defaultSettings: SiteSettings = {
  branding: {
    site_name: 'Voyyara',
    logo_icon: '✈️',
  },
  main_nav: [
    { label: 'Destinations', url: '/destinations' },
    { label: 'Planner', url: '/planner' },
  ],
  header_ctas: {
    sign_in_text: 'Sign In',
    sign_in_link: '/signin',
    primary_cta_text: 'Start Planning',
    primary_cta_link: '/planner',
  },
};

export function Header() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    // Fetch site settings from API
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - TEXT FROM CMS */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-3xl font-bold text-gray-900">
                {settings.branding?.logo_icon} {settings.branding?.site_name}
              </span>
            </motion.div>
          </Link>

          {/* Navigation - FROM CMS */}
          <nav className="hidden md:flex items-center space-x-8">
            {settings.main_nav?.map((item, index) => (
              <Link 
                key={index}
                href={item.url}
                target={item.new_tab ? '_blank' : undefined}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Localization - TEXT FROM CMS */}
          <div className="flex items-center space-x-4">
            <LocalizationSwitcher compact />
            
            <Button 
              variant="ghost" 
              className="hidden sm:inline-flex text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              asChild
            >
              <Link href={settings.header_ctas?.sign_in_link || '/signin'}>
                {settings.header_ctas?.sign_in_text}
              </Link>
            </Button>
            <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
              <Link href={settings.header_ctas?.primary_cta_link || '/planner'}>
                {settings.header_ctas?.primary_cta_text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
