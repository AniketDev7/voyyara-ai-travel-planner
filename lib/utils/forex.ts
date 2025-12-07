'use client';

/**
 * Forex Conversion Utility
 * Converts prices between currencies using exchange rates
 */

// Exchange rates relative to USD (base currency)
// These can be updated periodically or fetched from an API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.50,
  JPY: 149.50,
  SGD: 1.34,
  THB: 35.20,
  VND: 24500,
  AUD: 1.53,
  CAD: 1.36,
  KRW: 1320,
  CNY: 7.24,
};

// Currency symbols and formatting
export const CURRENCY_INFO: Record<string, { symbol: string; name: string; locale: string; decimals: number }> = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', decimals: 0 },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', decimals: 0 },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', decimals: 0 },
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', decimals: 0 },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimals: 0 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', decimals: 0 },
  THB: { symbol: '฿', name: 'Thai Baht', locale: 'th-TH', decimals: 0 },
  VND: { symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN', decimals: 0 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', decimals: 0 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', decimals: 0 },
  KRW: { symbol: '₩', name: 'Korean Won', locale: 'ko-KR', decimals: 0 },
  CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', decimals: 0 },
};

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;
  
  return Math.round(convertedAmount);
}

/**
 * Format a price with currency symbol
 */
export function formatPrice(
  amount: number,
  currencyCode: string,
  options?: { showCode?: boolean; compact?: boolean }
): string {
  const info = CURRENCY_INFO[currencyCode] || CURRENCY_INFO.USD;
  
  try {
    const formatter = new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals,
      notation: options?.compact ? 'compact' : 'standard',
    });
    
    let formatted = formatter.format(amount);
    
    // Add currency code if requested
    if (options?.showCode) {
      formatted += ` ${currencyCode}`;
    }
    
    return formatted;
  } catch {
    // Fallback formatting
    return `${info.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Parse a price string like "From $1,200" or "₹1,85,000" to extract the number
 */
export function parsePriceString(priceString: string): { amount: number; currency: string } | null {
  if (!priceString) return null;
  
  // Remove common prefixes
  const cleaned = priceString.replace(/^(From|Starting at|Price:)\s*/i, '').trim();
  
  // Try to detect currency from symbol
  let detectedCurrency = 'USD';
  for (const [code, info] of Object.entries(CURRENCY_INFO)) {
    if (cleaned.startsWith(info.symbol) || cleaned.includes(info.symbol)) {
      detectedCurrency = code;
      break;
    }
  }
  
  // Extract number (remove currency symbols, commas, spaces)
  const numberMatch = cleaned.match(/[\d,]+(?:\.\d+)?/);
  if (!numberMatch) return null;
  
  const amount = parseFloat(numberMatch[0].replace(/,/g, ''));
  if (isNaN(amount)) return null;
  
  return { amount, currency: detectedCurrency };
}

/**
 * Convert a price string to a different currency
 */
export function convertPriceString(
  priceString: string,
  toCurrency: string,
  options?: { prefix?: string; showCode?: boolean }
): string {
  const parsed = parsePriceString(priceString);
  if (!parsed) return priceString; // Return original if parsing fails
  
  const converted = convertCurrency(parsed.amount, parsed.currency, toCurrency);
  const formatted = formatPrice(converted, toCurrency, { showCode: options?.showCode });
  
  const prefix = options?.prefix ?? 'From ';
  return `${prefix}${formatted}`;
}

/**
 * Get current exchange rate
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  return toRate / fromRate;
}

/**
 * Hook-friendly function to get user's selected currency
 */
export function getSelectedCurrency(): string {
  if (typeof window === 'undefined') return 'USD';
  return localStorage.getItem('voyyara_currency') || 'USD';
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_INFO[currencyCode]?.symbol || '$';
}

// ============================================
// Optional: Fetch live rates from API
// ============================================

let cachedRates: Record<string, number> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch live exchange rates (optional - uses free API)
 * Falls back to static rates if API fails
 */
export async function fetchLiveRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
  // Check cache first
  if (cachedRates && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }
  
  try {
    // Using free exchangerate-api (no key required for basic usage)
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour in Next.js
    );
    
    if (!response.ok) throw new Error('Failed to fetch rates');
    
    const data = await response.json();
    cachedRates = data.rates;
    cacheTimestamp = Date.now();
    
    return cachedRates as Record<string, number>;
  } catch (error) {
    console.warn('[Forex] Failed to fetch live rates, using static rates:', error);
    return EXCHANGE_RATES;
  }
}

/**
 * Convert with live rates (async version)
 */
export async function convertCurrencyLive(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  const rates = await fetchLiveRates(fromCurrency);
  const rate = rates[toCurrency] || 1;
  return Math.round(amount * rate);
}

