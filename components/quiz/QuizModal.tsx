'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TravelPreferenceQuiz from './TravelPreferenceQuiz';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (preferences: Record<string, string | string[]>) => void;
}

export default function QuizModal({ isOpen, onClose, onComplete }: QuizModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal container - flexbox centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto"
              style={{ maxHeight: 'min(500px, calc(100vh - 60px))' }}
            >
              <div className="p-4 md:p-5 overflow-y-auto" style={{ maxHeight: 'inherit' }}>
                <TravelPreferenceQuiz
                  onComplete={(prefs) => {
                    onComplete?.(prefs);
                    // Don't close immediately - let the completion screen show
                  }}
                  onClose={onClose}
                  compact={true}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

