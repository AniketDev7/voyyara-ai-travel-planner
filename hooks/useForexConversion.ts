'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  convertCurrency, 
  convertPriceString, 
  formatPrice, 
  getSelectedCurrency,
  getCurrencySymbol,
  CURRENCY_INFO 
} from '@/lib/utils/forex';

/**
 * Hook for currency conversion with automatic updates when currency changes
 */
export function useForexConversion() {
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Load currency from localStorage on mount
  useEffect(() => {
    const saved = getSelectedCurrency();
    setCurrency(saved);
    setIsLoading(false);

    // Listen for currency changes
    const handleCurrencyChange = (e: CustomEvent) => {
      setCurrency(e.detail.code);
    };

    window.addEventListener('currencyChange' as any, handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange' as any, handleCurrencyChange);
    };
  }, []);

  /**
   * Convert a numeric amount from USD to selected currency
   */
  const convert = useCallback((amount: number, fromCurrency: string = 'USD'): number => {
    return convertCurrency(amount, fromCurrency, currency);
  }, [currency]);

  /**
   * Convert a price string (e.g., "From $1,200") to selected currency
   */
  const convertPrice = useCallback((priceString: string, options?: { prefix?: string }): string => {
    return convertPriceString(priceString, currency, options);
  }, [currency]);

  /**
   * Format a number as price in selected currency
   */
  const format = useCallback((amount: number, options?: { showCode?: boolean; compact?: boolean }): string => {
    return formatPrice(amount, currency, options);
  }, [currency]);

  /**
   * Get the current currency symbol
   */
  const symbol = getCurrencySymbol(currency);

  /**
   * Get full currency info
   */
  const currencyInfo = CURRENCY_INFO[currency] || CURRENCY_INFO.USD;

  return {
    currency,
    symbol,
    currencyInfo,
    convert,
    convertPrice,
    format,
    isLoading,
  };
}

/**
 * Component wrapper for price display with automatic conversion
 */
export function useConvertedPrice(priceString: string, options?: { prefix?: string }) {
  const { convertPrice, isLoading, currency } = useForexConversion();
  
  if (isLoading) return { price: priceString, currency: 'USD', isConverting: true };
  
  return {
    price: convertPrice(priceString, options),
    currency,
    isConverting: false,
  };
}

