/**
 * api.js — live data fetching.
 *
 * AAPL price is fetched server-side by PHP (includes/aapl.php) and injected
 * into APP_DATA at render time, avoiding CORS restrictions entirely.
 *
 * This module only fetches live FX rates from Frankfurter (ECB data),
 * which is CORS-open and does not require an API key.
 */

import { aaplPriceUSD, aaplPriceDate } from './data.js';

// Approximate fallback rates — updated manually every few months
const FALLBACK_FX = { USD: 1, CAD: 1.44, GBP: 0.79, AUD: 1.62 };

/**
 * Fetch current USD → CAD/GBP/AUD rates from Frankfurter (ECB data).
 * @returns {{ USD: 1, CAD: number, GBP: number, AUD: number }}
 */
async function fetchFxRates() {
    const url = 'https://api.frankfurter.app/latest?from=USD&to=CAD,GBP,AUD';
    const res  = await fetch(url);

    if (!res.ok) throw new Error(`Frankfurter responded ${res.status}`);

    const json = await res.json();
    return { USD: 1, CAD: json.rates.CAD, GBP: json.rates.GBP, AUD: json.rates.AUD };
}

/**
 * Initialise live data.
 * AAPL price comes from PHP-injected APP_DATA (server-side fetch, no CORS).
 * FX rates are fetched client-side from Frankfurter with fallback on failure.
 *
 * @returns {Promise<{
 *   aaplPriceUSD:  number,
 *   aaplPriceDate: string,
 *   fxRates:       { USD: 1, CAD: number, GBP: number, AUD: number },
 *   fxSource:      'live' | 'cached',
 * }>}
 */
export async function initialise() {
    let fxRates  = FALLBACK_FX;
    let fxSource = 'cached';

    try {
        fxRates  = await fetchFxRates();
        fxSource = 'live';
    } catch {
        // Silent fallback — user sees "(cached rate)" note in UI
    }

    return {
        aaplPriceUSD,
        aaplPriceDate,
        fxRates,
        fxSource,
    };
}
