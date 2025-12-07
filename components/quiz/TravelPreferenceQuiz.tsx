'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { setPersonalizeAttribute } from '@/lib/personalize/tracking';

interface QuizOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

interface QuizStep {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  maxSelections?: number;
}

const quizSteps: QuizStep[] = [
  {
    id: 'travel_style',
    question: "What's your travel style?",
    subtitle: "How do you like to travel?",
    type: 'single',
    options: [
      { id: 'luxury', label: 'Luxury', icon: '👑', description: '5-star hotels, fine dining, premium experiences' },
      { id: 'mid_range', label: 'Mid-Range', icon: '⭐', description: 'Comfortable stays, good food, quality experiences' },
      { id: 'budget', label: 'Budget-Friendly', icon: '💰', description: 'Value for money, hostels, local eateries' },
      { id: 'backpacker', label: 'Backpacker', icon: '🎒', description: 'Hostels, street food, off-the-beaten-path' },
    ],
  },
  {
    id: 'traveler_type',
    question: "Who are you traveling with?",
    subtitle: "This helps us tailor recommendations",
    type: 'single',
    options: [
      { id: 'solo', label: 'Solo', icon: '🚶', description: 'Just me, myself, and I' },
      { id: 'couple', label: 'Couple', icon: '💑', description: 'Romantic getaway for two' },
      { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'With kids or multi-generational' },
      { id: 'friends', label: 'Friends', icon: '👯', description: 'Group adventure with friends' },
    ],
  },
  {
    id: 'interests',
    question: "What excites you most?",
    subtitle: "Select up to 4 interests",
    type: 'multiple',
    maxSelections: 4,
    options: [
      { id: 'culture', label: 'Culture & History', icon: '🏛️' },
      { id: 'food', label: 'Food & Culinary', icon: '🍜' },
      { id: 'adventure', label: 'Adventure', icon: '🏔️' },
      { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
      { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
      { id: 'photography', label: 'Photography', icon: '📸' },
      { id: 'nightlife', label: 'Nightlife', icon: '🎉' },
      { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    ],
  },
  {
    id: 'pace',
    question: "What's your ideal travel pace?",
    subtitle: "How packed should your days be?",
    type: 'single',
    options: [
      { id: 'relaxed', label: 'Relaxed', icon: '🐢', description: '2-3 activities per day, plenty of downtime' },
      { id: 'moderate', label: 'Moderate', icon: '🦊', description: '4-5 activities, balanced with free time' },
      { id: 'packed', label: 'Action-Packed', icon: '🐆', description: 'See it all! Maximum experiences' },
    ],
  },
  {
    id: 'duration',
    question: "How long do you usually travel?",
    subtitle: "Your typical trip length",
    type: 'single',
    options: [
      { id: 'short', label: 'Short Trip', icon: '📅', description: '4-7 days' },
      { id: 'medium', label: 'Medium Trip', icon: '🗓️', description: '8-10 days' },
      { id: 'long', label: 'Long Trip', icon: '📆', description: '10-14 days' },
      { id: 'extended', label: 'Extended', icon: '🌍', description: '14-20 days' },
    ],
  },
];

interface TravelPreferenceQuizProps {
  onComplete?: (preferences: Record<string, string | string[]>) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  redirectToResults?: boolean; // New prop to control redirect behavior
  compact?: boolean; // Compact mode for modal
}

export default function TravelPreferenceQuiz({ 
  onComplete, 
  onClose,
  showCloseButton = true,
  redirectToResults = true, // Default: redirect to results page
  compact = false, // Default: not compact
}: TravelPreferenceQuizProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const currentQuestion = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  const handleSelect = useCallback((optionId: string) => {
    const step = quizSteps[currentStep];
    
    if (step.type === 'single') {
      setAnswers(prev => ({ ...prev, [step.id]: optionId }));
      
      // Auto-advance for single selection after a brief delay
      setTimeout(() => {
        if (currentStep < quizSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }, 300);
    } else {
      // Multiple selection
      setAnswers(prev => {
        const current = (prev[step.id] as string[]) || [];
        const maxSelections = step.maxSelections || 10;
        
        if (current.includes(optionId)) {
          return { ...prev, [step.id]: current.filter(id => id !== optionId) };
        } else if (current.length < maxSelections) {
          return { ...prev, [step.id]: [...current, optionId] };
        }
        return prev;
      });
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Quiz complete - save preferences
      savePreferences();
    }
  }, [currentStep, answers]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const savePreferences = useCallback(() => {
    // Save to localStorage
    localStorage.setItem('voyyara_preferences', JSON.stringify(answers));
    
    // Map quiz keys to Personalize attribute keys
    const attributeKeyMap: Record<string, string> = {
      'travel_style': 'price_type',      // Maps to existing Personalize attribute
      'traveler_type': 'traveler_type',  // New attribute
      'interests': 'user_interests',      // New attribute (comma-separated)
      'pace': 'travel_pace',              // New attribute
      'duration': 'trip_duration',        // New attribute
    };
    
    // Update Personalize attributes with mapped keys
    Object.entries(answers).forEach(([key, value]) => {
      const attrKey = attributeKeyMap[key] || key;
      const attrValue = Array.isArray(value) ? value.join(',') : value;
      setPersonalizeAttribute(attrKey, attrValue);
    });
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('preferencesUpdated', { detail: answers }));
    
    setIsComplete(true);
    onComplete?.(answers);
    
    // Redirect to results page after a brief animation
    if (redirectToResults) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/quiz/results');
      }, 1500);
    }
  }, [answers, onComplete, redirectToResults, router]);

  const isCurrentStepValid = useCallback(() => {
    const step = quizSteps[currentStep];
    const answer = answers[step.id];
    
    if (step.type === 'single') {
      return !!answer;
    } else {
      return Array.isArray(answer) && answer.length > 0;
    }
  }, [currentStep, answers]);

  const getSelectedOptions = (stepId: string): string[] => {
    const answer = answers[stepId];
    if (!answer) return [];
    return Array.isArray(answer) ? answer : [answer];
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center ${compact ? 'py-6 px-4' : 'py-12 px-6'}`}
      >
        {isRedirecting ? (
          // Finding matches animation
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className={`${compact ? 'text-5xl mb-3' : 'text-7xl mb-6'} inline-block`}
            >
              🔍
            </motion.div>
            <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl mb-2' : 'text-3xl mb-4'}`}>
              Finding Your Perfect Matches...
            </h2>
            <p className={`text-gray-600 max-w-md mx-auto ${compact ? 'text-sm mb-4' : 'mb-8'}`}>
              Analyzing your preferences to find the best itineraries
            </p>
            <div className="flex justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2.5 h-2.5 bg-purple-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2.5 h-2.5 bg-purple-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2.5 h-2.5 bg-purple-600 rounded-full"
              />
            </div>
          </>
        ) : (
          // Success message (for non-redirect mode)
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={compact ? "text-5xl mb-3" : "text-7xl mb-6"}
            >
              🎉
            </motion.div>
            <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl mb-2' : 'text-3xl mb-4'}`}>
              You're All Set!
            </h2>
            <p className={`text-gray-600 max-w-md mx-auto ${compact ? 'text-sm mb-4' : 'mb-8'}`}>
              We've saved your preferences for personalized recommendations.
            </p>
            <div className={`flex flex-wrap justify-center gap-2 ${compact ? 'mb-4' : 'mb-8'}`}>
              {Object.entries(answers).map(([key, value]) => {
                const step = quizSteps.find(s => s.id === key);
                const values = Array.isArray(value) ? value : [value];
                return values.map(v => {
                  const option = step?.options.find(o => o.id === v);
                  return option ? (
                    <span
                      key={`${key}-${v}`}
                      className={`bg-purple-100 text-purple-700 rounded-full font-medium ${compact ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}`}
                    >
                      {option.icon} {option.label}
                    </span>
                  ) : null;
                });
              })}
            </div>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full"
            >
              Start Exploring →
            </Button>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <div className={compact ? "max-w-md mx-auto" : "max-w-2xl mx-auto"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-6'}`}>
        <div className="flex items-center gap-2">
          <span className={compact ? "text-lg" : "text-2xl"}>✈️</span>
          <span className={`font-medium text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
            Step {currentStep + 1} of {quizSteps.length}
          </span>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className={`text-gray-500 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`bg-gray-200 rounded-full ${compact ? 'h-1 mb-3' : 'h-1.5 mb-8'} overflow-hidden`}>
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className={`font-bold text-gray-900 ${compact ? 'text-lg mb-0.5' : 'text-2xl md:text-3xl mb-2'}`}>
            {currentQuestion.question}
          </h2>
          {currentQuestion.subtitle && (
            <p className={`text-gray-500 ${compact ? 'text-xs mb-3' : 'mb-8'}`}>{currentQuestion.subtitle}</p>
          )}

          {/* Options - Compact grid */}
          <div className={`grid ${compact ? 'gap-1.5' : 'gap-4'} ${
            currentQuestion.options.length > 4 
              ? (compact ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-4')
              : 'grid-cols-2'
          }`}>
            {currentQuestion.options.map((option) => {
              const isSelected = getSelectedOptions(currentQuestion.id).includes(option.id);
              const isManyOptions = currentQuestion.options.length > 4;
              
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${compact ? (isManyOptions ? 'p-2' : 'p-2.5') : 'p-4 md:p-6'} rounded-xl border-2 text-left transition-all relative ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  {/* For many options in compact mode, stack vertically and center */}
                  {compact && isManyOptions ? (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-lg mb-0.5">{option.icon}</span>
                      <div className="font-medium text-gray-900 text-[11px] leading-tight">{option.label}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={compact ? "text-xl" : "text-3xl"}>{option.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-gray-900 ${compact ? 'text-sm leading-tight' : ''}`}>{option.label}</div>
                        {option.description && compact && (
                          <div className="text-[11px] text-gray-500 truncate">{option.description}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {option.description && !compact && (
                    <div className="text-sm text-gray-500 mt-2">{option.description}</div>
                  )}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute ${compact ? 'top-1 right-1 w-3.5 h-3.5' : 'top-3 right-3 w-6 h-6'} bg-purple-600 rounded-full flex items-center justify-center`}
                    >
                      <svg className={compact ? "w-2 h-2 text-white" : "w-4 h-4 text-white"} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className={`flex justify-between ${compact ? 'mt-4' : 'mt-10'}`}>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={compact ? "px-3 py-1.5 text-sm h-auto" : "px-6"}
        >
          ← Back
        </Button>
        
        {currentQuestion.type === 'multiple' || currentStep === quizSteps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white ${compact ? 'px-4 py-1.5 text-sm h-auto' : 'px-8'}`}
          >
            {currentStep === quizSteps.length - 1 ? 'Complete' : 'Next'} →
          </Button>
        ) : null}
      </div>
    </div>
  );
}

