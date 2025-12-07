'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePreferences } from '@/hooks/usePreferences';
import { QuizModal } from './index';

interface QuizPromptProps {
  variant?: 'banner' | 'floating' | 'inline';
  /** If true, shows on all pages. If false, only shows on /destinations */
  showOnAllPages?: boolean;
}

export default function QuizPrompt({ variant = 'banner', showOnAllPages = false }: QuizPromptProps) {
  const pathname = usePathname();
  const { hasCompletedQuiz, isLoading, preferences } = usePreferences();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show prompt after a delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // 2 second delay
    
    return () => clearTimeout(timer);
  }, []);

  // Check if user has dismissed the prompt this session
  useEffect(() => {
    const isDismissed = sessionStorage.getItem('quiz_prompt_dismissed');
    if (isDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('quiz_prompt_dismissed', 'true');
    setDismissed(true);
  };

  // DEMO MODE: Show on destinations page regardless of quiz completion
  // TODO: Re-enable localStorage check when sign-up flow is implemented
  // if (isLoading || hasCompletedQuiz || dismissed) {
  //   return null;
  // }
  
  // For demo: Only check if dismissed, always show on destinations page
  const isDestinationsPage = pathname?.startsWith('/destinations');
  const shouldShow = showOnAllPages || isDestinationsPage;
  
  if (!shouldShow || dismissed || !isVisible) {
    return null;
  }

  if (variant === 'floating') {
    return (
      <>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border border-purple-100">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">
                Personalize Your Experience
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Take a quick 2-minute quiz and get travel recommendations tailored just for you!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
              >
                Take the Quiz →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <QuizModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎯</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Get Personalized Recommendations</h3>
              <p className="text-white/80 text-sm">Answer a few questions to unlock trips perfect for you</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Take Quiz
            </button>
          </div>
        </motion.div>

        <QuizModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  // Default banner variant
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4 text-sm md:text-base">
            <span>🎯</span>
            <span>Get personalized travel recommendations!</span>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm"
            >
              Take the Quiz
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      <QuizModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

