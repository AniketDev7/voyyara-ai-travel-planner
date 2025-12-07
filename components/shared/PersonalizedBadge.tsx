'use client';

import { motion } from 'framer-motion';
import { usePreferences } from '@/hooks/usePreferences';

interface PersonalizedBadgeProps {
  matchScore?: number;
  matchReasons?: string[];
  compact?: boolean;
}

export default function PersonalizedBadge({ 
  matchScore, 
  matchReasons = [],
  compact = false 
}: PersonalizedBadgeProps) {
  const { hasCompletedQuiz } = usePreferences();
  
  if (!hasCompletedQuiz) return null;
  
  // Determine match quality
  const getMatchQuality = () => {
    if (!matchScore) return null;
    if (matchScore >= 80) return { label: 'Perfect Match', emoji: '✨', color: 'from-green-500 to-emerald-500' };
    if (matchScore >= 60) return { label: 'Great Match', emoji: '🎯', color: 'from-purple-500 to-pink-500' };
    if (matchScore >= 40) return { label: 'Good Match', emoji: '👍', color: 'from-blue-500 to-cyan-500' };
    return { label: 'Suggested', emoji: '💡', color: 'from-gray-500 to-gray-600' };
  };
  
  const quality = getMatchQuality();
  
  if (!quality) {
    // Just show a generic personalized badge
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg"
      >
        <span>✨</span>
        <span>For You</span>
      </motion.div>
    );
  }
  
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${quality.color} text-white text-xs font-semibold rounded-full shadow-lg`}
      >
        <span>{quality.emoji}</span>
        <span>{matchScore}% Match</span>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${quality.color} flex items-center justify-center text-2xl`}>
          {quality.emoji}
        </div>
        <div>
          <div className="font-bold text-gray-900">{quality.label}</div>
          <div className="text-sm text-gray-500">{matchScore}% match to your preferences</div>
        </div>
      </div>
      
      {matchReasons.length > 0 && (
        <div className="space-y-1.5">
          {matchReasons.slice(0, 3).map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              {reason}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

