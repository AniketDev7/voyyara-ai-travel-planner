'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LocalizationSwitcher } from './LocalizationSwitcher';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-3xl font-bold text-gray-900">
                ✈️ Voyyara
              </span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/destinations" 
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Destinations
            </Link>
            <Link 
              href="/planner" 
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Planner
            </Link>
          </nav>

          {/* CTA + Localization */}
          <div className="flex items-center space-x-4">
            {/* Currency/Language Switcher */}
            <LocalizationSwitcher compact />
            
            <Button variant="ghost" className="hidden sm:inline-flex text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Sign In
            </Button>
            <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
              <Link href="/planner">
                Start Planning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

