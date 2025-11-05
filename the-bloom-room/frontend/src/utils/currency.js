/**
 * Currency utility functions for The Bloom Room
 * Handles South African Rand (ZAR) formatting
 */

/**
 * Format a price value with South African Rand symbol
 * @param {number|string} price - The price to format
 * @param {boolean} showSymbol - Whether to show the R symbol (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, showSymbol = true) => {
  if (!price || price === 0) return showSymbol ? 'R0' : '0';
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return showSymbol ? 'R0' : '0';
  
  // Format with thousand separators for larger amounts
  const formatted = numPrice.toLocaleString('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return showSymbol ? `R${formatted}` : formatted;
};

/**
 * Format a price value with full South African Rand notation
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price string with ZAR notation
 */
export const formatPriceWithCurrency = (price) => {
  const formatted = formatPrice(price, false);
  return `R${formatted} ZAR`;
};

/**
 * Parse a price string and return a number
 * @param {string} priceString - Price string that may contain R symbol
 * @returns {number} Parsed price as number
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  
  // Remove R symbol and any spaces, then parse
  const cleaned = priceString.toString().replace(/[R\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Currency constants
 */
export const CURRENCY = {
  SYMBOL: 'R',
  CODE: 'ZAR',
  NAME: 'South African Rand'
};