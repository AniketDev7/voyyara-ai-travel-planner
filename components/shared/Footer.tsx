'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FooterLink {
  section_title: string;
  link1_label?: string;
  link1_url?: string;
  link2_label?: string;
  link2_url?: string;
}

interface SiteSettings {
  branding?: {
    site_name?: string;
    logo_icon?: string;
  };
  footer?: {
    description?: string;
    copyright?: string;
  };
  footer_links?: FooterLink[];
}

// Default settings (fallback)
const defaultSettings: SiteSettings = {
  branding: {
    site_name: 'Voyyara',
    logo_icon: '✈️',
  },
  footer: {
    description: 'Plan your perfect trip with personalized itineraries. Get tailored recommendations in seconds.',
    copyright: '© 2025 Voyyara. Powered by Contentstack.',
  },
  footer_links: [
    { section_title: 'Product', link1_label: 'Destinations', link1_url: '/destinations', link2_label: 'Planner', link2_url: '/planner' },
    { section_title: 'Company', link1_label: 'About', link1_url: '/about', link2_label: 'Contact', link2_url: '/contact' },
  ],
};

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
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
    <footer className="bg-transparent backdrop-blur-sm border-t border-gray-200/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand - FROM CMS */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {settings.branding?.logo_icon} {settings.branding?.site_name}
            </h3>
            <p className="text-gray-600 mb-4">
              {settings.footer?.description}
            </p>
          </div>

          {/* Footer Link Sections - FROM CMS */}
          {settings.footer_links?.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-4">{section.section_title}</h4>
              <ul className="space-y-2">
                {section.link1_label && section.link1_url && (
                  <li>
                    <Link href={section.link1_url} className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                      {section.link1_label}
                    </Link>
                  </li>
                )}
                {section.link2_label && section.link2_url && (
                  <li>
                    <Link href={section.link2_url} className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                      {section.link2_label}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright - FROM CMS */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          {settings.footer?.copyright}
        </div>
      </div>
    </footer>
  );
}
