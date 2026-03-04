/**
 * data.js — static application data, injected by PHP at render time.
 *
 * This file is intentionally left empty in source control.
 * index.php renders a <script> block that sets window.APP_DATA before
 * this file is loaded, so all modules can import from it safely.
 *
 * Shape of window.APP_DATA:
 * {
 *   products:          Array<Product>,
 *   historicalData:    Object<year, HistoricalEntry>,
 *   dividendSchedule:  Array<DividendEntry>,
 *   quarterlyPrices:   Object<"YYYY-Q", number>,
 *   luxuries:          Array<Luxury>,
 * }
 *
 * See index.php for the injection block.
 */

// Re-export for convenient named imports across other modules
export const {
    products,
    historicalData,
    dividendSchedule,
    quarterlyPrices,
    luxuries,
    everyday,
    aaplPriceUSD,
    aaplPriceDate,
} = window.APP_DATA;

export const CURRENCIES = {
    USD: { symbol: '$',  code: 'USD', name: 'US Dollar',         flag: '🇺🇸' },
    CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar',   flag: '🇨🇦' },
    GBP: { symbol: '£',  code: 'GBP', name: 'British Pound',     flag: '🇬🇧' },
    AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
};
