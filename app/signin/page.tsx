'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-6"
        >
          🚀
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Coming Soon!
        </h1>
        
        <p className="text-gray-600 mb-8">
          We&apos;re working on user accounts to save your favorite itineraries and travel preferences. 
          Stay tuned for updates!
        </p>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 mb-8">
          <p className="text-sm text-gray-700 font-medium mb-3">
            What you&apos;ll get with an account:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Save your favorite itineraries
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Personalized recommendations
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Sync across devices
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Exclusive travel deals
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl"
          >
            <Link href="/planner">
              Start Planning Now
            </Link>
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900"
          >
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          This is a demo project showcasing Contentstack DXP capabilities
        </p>
      </motion.div>
    </div>
  );
}
