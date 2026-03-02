/**
 * api.js — live data fetching.
 *
 * Fetches AAPL last-close price from Yahoo Finance and current FX rates
 * from Frankfurter (European Central Bank feed). Both endpoints are
 * CORS-open and require no API key.
 *
 * Exports a single initialise() function that resolves with the live
 * data, falling back to hardcoded values if either endpoint is down.
 */

const FALLBACK_AAPL_USD  = 264.18;
const FALLBACK_AAPL_DATE = 'Feb 27, 2026 (cached)';

// Approximate fallback rates — updated manually every few months
const FALLBACK_FX = { USD: 1, CAD: 1.44, GBP: 0.79, AUD: 1.62 };

/**
 * Fetch AAPL last-close price.
 * @returns {{ priceUSD: number, dateStr: string }}
 */
async function fetchAaplPrice() {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=5d';
    const res  = await fetch(url);

    if (!res.ok) throw new Error(`Yahoo Finance responded ${res.status}`);

    const json = await res.json();
    const meta = json.chart.result[0].meta;
    const price = meta.chartPreviousClose ?? meta.regularMarketPrice;
    const dateStr = new Date(meta.regularMarketTime * 1000).toLocaleDateString(
        'en-CA',
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    return { priceUSD: parseFloat(price.toFixed(2)), dateStr };
}

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
 * Initialise live data. Runs both fetches in parallel and returns
 * whichever values succeed; falls back gracefully on failure.
 *
 * @returns {Promise<{
 *   aaplPriceUSD:  number,
 *   aaplPriceDate: string,
 *   fxRates:       { USD: 1, CAD: number, GBP: number, AUD: number },
 *   fxSource:      'live' | 'cached',
 * }>}
 */
export async function initialise() {
    const [aaplResult, fxResult] = await Promise.allSettled([
        fetchAaplPrice(),
        fetchFxRates(),
    ]);

    const aapl = aaplResult.status === 'fulfilled'
        ? aaplResult.value
        : { priceUSD: FALLBACK_AAPL_USD, dateStr: FALLBACK_AAPL_DATE };

    const fxRates  = fxResult.status === 'fulfilled' ? fxResult.value : FALLBACK_FX;
    const fxSource = fxResult.status === 'fulfilled' ? 'live' : 'cached';

    return {
        aaplPriceUSD:  aapl.priceUSD,
        aaplPriceDate: aapl.dateStr,
        fxRates,
        fxSource,
    };
}
