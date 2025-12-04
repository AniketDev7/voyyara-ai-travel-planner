'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setPersonalizeAttribute } from '@/lib/personalize/tracking';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', flag: '🇻🇳' },
];

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
];

interface LocalizationSwitcherProps {
  onCurrencyChange?: (currency: Currency) => void;
  onLanguageChange?: (language: Language) => void;
  defaultCurrency?: string;
  defaultLanguage?: string;
  compact?: boolean;
}

export function LocalizationSwitcher({
  onCurrencyChange,
  onLanguageChange,
  defaultCurrency = 'USD',
  defaultLanguage = 'en',
  compact = false,
}: LocalizationSwitcherProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    CURRENCIES.find((c) => c.code === defaultCurrency) || CURRENCIES[0]
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES.find((l) => l.code === defaultLanguage) || LANGUAGES[0]
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('voyyara_currency');
    const savedLanguage = localStorage.getItem('voyyara_language');

    if (savedCurrency) {
      const currency = CURRENCIES.find((c) => c.code === savedCurrency);
      if (currency) setSelectedCurrency(currency);
    }

    if (savedLanguage) {
      const language = LANGUAGES.find((l) => l.code === savedLanguage);
      if (language) setSelectedLanguage(language);
    }
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('voyyara_currency', currency.code);
    localStorage.setItem('voyyara_currency_symbol', currency.symbol);
    
    // Set Personalize attribute for audience matching
    setPersonalizeAttribute('user_currency', currency.code);
    
    // Trigger global event for other components to listen
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
    
    onCurrencyChange?.(currency);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem('voyyara_language', language.code);
    
    // Set Personalize attribute for audience matching
    setPersonalizeAttribute('user_language', language.code);
    
    // Trigger global event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
    
    onLanguageChange?.(language);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Currency Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 px-2">
              <span>{selectedCurrency.symbol}</span>
              <span className="text-xs font-medium">{selectedCurrency.code}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {CURRENCIES.map((currency) => (
              <DropdownMenuItem
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <span className="text-xl">{currency.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
                {selectedCurrency.code === currency.code && (
                  <span className="text-purple-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 px-2">
              <span>{selectedLanguage.flag}</span>
              <span className="text-xs font-medium uppercase">{selectedLanguage.code}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <span className="text-xl">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.nativeName}</div>
                </div>
                {selectedLanguage.code === language.code && (
                  <span className="text-purple-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Currency Selector */}
      <div className="flex-1">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Currency</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">{selectedCurrency.flag}</span>
                <span className="font-medium">{selectedCurrency.code}</span>
                <span className="text-gray-500">({selectedCurrency.symbol})</span>
              </span>
              <span>▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {CURRENCIES.map((currency) => (
              <DropdownMenuItem
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className="flex items-center gap-3 cursor-pointer py-3"
              >
                <span className="text-2xl">{currency.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{currency.code} - {currency.symbol}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
                {selectedCurrency.code === currency.code && (
                  <span className="text-purple-600 text-lg">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Language Selector */}
      <div className="flex-1">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Language</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">{selectedLanguage.flag}</span>
                <span className="font-medium">{selectedLanguage.name}</span>
              </span>
              <span>▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="flex items-center gap-3 cursor-pointer py-3"
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.nativeName}</div>
                </div>
                {selectedLanguage.code === language.code && (
                  <span className="text-purple-600 text-lg">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Hook to use localization in other components
export function useLocalization() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);

  useEffect(() => {
    // Load from localStorage
    const savedCurrency = localStorage.getItem('voyyara_currency');
    const savedLanguage = localStorage.getItem('voyyara_language');

    if (savedCurrency) {
      const curr = CURRENCIES.find((c) => c.code === savedCurrency);
      if (curr) setCurrency(curr);
    }

    if (savedLanguage) {
      const lang = LANGUAGES.find((l) => l.code === savedLanguage);
      if (lang) setLanguage(lang);
    }

    // Listen for changes
    const handleCurrencyChange = (e: any) => setCurrency(e.detail);
    const handleLanguageChange = (e: any) => setLanguage(e.detail);

    window.addEventListener('currencyChange' as any, handleCurrencyChange);
    window.addEventListener('languageChange' as any, handleLanguageChange);

    return () => {
      window.removeEventListener('currencyChange' as any, handleCurrencyChange);
      window.removeEventListener('languageChange' as any, handleLanguageChange);
    };
  }, []);

  return { currency, language };
}

