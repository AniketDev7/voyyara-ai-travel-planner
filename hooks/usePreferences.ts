'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  travel_style?: string;
  traveler_type?: string;
  interests?: string[];
  pace?: string;
  duration?: string;
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('voyyara_preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
        setHasCompletedQuiz(true);
      } catch (e) {
        console.error('Error parsing stored preferences:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for preference updates
  useEffect(() => {
    const handleUpdate = (event: CustomEvent<UserPreferences>) => {
      setPreferences(event.detail);
      setHasCompletedQuiz(true);
    };

    window.addEventListener('preferencesUpdated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('preferencesUpdated', handleUpdate as EventListener);
    };
  }, []);

  const updatePreference = useCallback((key: keyof UserPreferences, value: string | string[]) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('voyyara_preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearPreferences = useCallback(() => {
    localStorage.removeItem('voyyara_preferences');
    setPreferences(null);
    setHasCompletedQuiz(false);
  }, []);

  const getPreferenceLabel = useCallback((key: keyof UserPreferences): string => {
    if (!preferences?.[key]) return '';
    
    const labels: Record<string, Record<string, string>> = {
      travel_style: {
        luxury: '👑 Luxury',
        mid_range: '⭐ Mid-Range',
        budget: '💰 Budget-Friendly',
        backpacker: '🎒 Backpacker',
      },
      traveler_type: {
        solo: '🚶 Solo',
        couple: '💑 Couple',
        family: '👨‍👩‍👧‍👦 Family',
        friends: '👯 Friends',
      },
      pace: {
        relaxed: '🐢 Relaxed',
        moderate: '🦊 Moderate',
        packed: '🐆 Action-Packed',
      },
      duration: {
        weekend: '📅 Weekend',
        week: '🗓️ One Week',
        two_weeks: '📆 Two Weeks',
        extended: '🌍 Extended',
      },
    };

    const value = preferences[key];
    if (Array.isArray(value)) {
      // For interests, just return the joined values
      return value.join(', ');
    }
    
    return labels[key]?.[value] || value;
  }, [preferences]);

  return {
    preferences,
    hasCompletedQuiz,
    isLoading,
    updatePreference,
    clearPreferences,
    getPreferenceLabel,
  };
}

