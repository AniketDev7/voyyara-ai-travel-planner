'use client';

import { useRouter } from 'next/navigation';
import TravelPreferenceQuiz from '@/components/quiz/TravelPreferenceQuiz';
import { motion } from 'framer-motion';

export default function QuizPage() {
  const router = useRouter();

  const handleComplete = (preferences: Record<string, string | string[]>) => {
    console.log('Quiz completed with preferences:', preferences);
    // The quiz component handles the redirect to /quiz/results
    // No additional redirect needed here
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let's Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Perfect Trip</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answer a few questions and we'll personalize your travel recommendations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-10 max-w-3xl mx-auto"
        >
          <TravelPreferenceQuiz 
            onComplete={handleComplete}
            onClose={handleClose}
          />
        </motion.div>
      </div>
    </div>
  );
}

