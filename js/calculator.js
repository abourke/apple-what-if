/**
 * calculator.js — pure financial calculation engine.
 *
 * No DOM access. All functions are deterministic given the same inputs
 * and can be unit-tested independently of the UI.
 */

import { historicalData, dividendSchedule, quarterlyPrices } from './data.js';

/**
 * Return the historicalData entry for the given year, or the nearest
 * available year if an exact match is not found.
 *
 * @param {number} year
 * @returns {object}
 */
export function nearestHistoricalYear(year) {
    if (historicalData[year]) return historicalData[year];

    const keys = Object.keys(historicalData).map(Number).sort((a, b) => a - b);
    const nearest = keys.reduce((prev, cur) =>
        Math.abs(cur - year) < Math.abs(prev - year) ? cur : prev
    );

    return historicalData[nearest];
}

/**
 * Simulate quarterly dividend reinvestment from purchaseYear to the
 * current date.
 *
 * Each quarter that Apple paid a dividend, the cash received (shares × div)
 * is immediately reinvested at that quarter's approximate closing price,
 * purchasing fractional new shares.  Those new shares also earn future
 * dividends — compounding is therefore fully modelled.
 *
 * @param {number} purchaseYear       — calendar year of original purchase
 * @param {number} sharesAtPurchase   — post-split share count at purchase date
 * @param {number} currentAaplUSD     — live AAPL price used as fallback price
 * @returns {{
 *   extraShares:  number,   — shares accumulated via dividends
 *   totalShares:  number,   — sharesAtPurchase + extraShares
 *   divSummary:   string,   — human-readable description of eras covered
 * }}
 */
export function simulateDRIP(purchaseYear, sharesAtPurchase, currentAaplUSD) {
    const now            = new Date();
    const currentYear    = now.getFullYear();
    const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);

    let shares      = sharesAtPurchase;
    let extraShares = 0;

    for (const { y, q, div } of dividendSchedule) {
        if (y < purchaseYear)  continue;   // before purchase
        if (y > currentYear)   continue;   // future
        if (y === currentYear && q > currentQuarter) continue;

        const key      = `${y}-${q}`;
        const price    = quarterlyPrices[key] ?? currentAaplUSD;
        const cash     = shares * div;
        const newShares = cash / price;

        shares      += newShares;
        extraShares += newShares;
    }

    // Describe which dividend eras applied
    const getsEra1 = purchaseYear <= 1994;
    const getsEra2 = currentYear >= 2012; // everyone holding today gets Era 2
    const eras = [
        getsEra1 && '1987–1994',
        getsEra2 && '2012–present',
    ].filter(Boolean).join(' and ');

    const divSummary = extraShares > 0
        ? `Dividends reinvested across ${eras}; ≈${extraShares.toFixed(1)} extra shares accumulated.`
        : 'No Apple dividends were paid during this holding period (1995–2011 gap).';

    return { extraShares, totalShares: shares, divSummary };
}

/**
 * Core calculation: given a product purchase, return what that money
 * would be worth today if invested in AAPL instead.
 *
 * @param {{
 *   productName:    string,
 *   year:           number,
 *   localPrice:     number,   — price in the selected currency
 *   currency:       string,   — 'USD' | 'CAD' | 'GBP' | 'AUD'
 *   fxRates:        object,   — live fx rates keyed by currency code
 *   aaplPriceUSD:   number,
 *   aaplPriceDate:  string,
 * }} params
 * @returns {object} result object consumed by ui.js
 */
export function calculate(params) {
    const {
        productName, year, localPrice, currency,
        fxRates, aaplPriceUSD, aaplPriceDate,
    } = params;

    const data = nearestHistoricalYear(year);
    const { aaplUSD, splitMult, fx } = data;

    // 1. Convert local price → USD at the historical exchange rate
    const historicalFX  = currency === 'USD' ? 1 : (fx[currency] ?? fxRates[currency]);
    const pricePaidUSD  = currency === 'USD' ? localPrice : localPrice / historicalFX;

    // 2. How many AAPL shares did that buy?
    const sharesOriginal   = pricePaidUSD / aaplUSD;
    const sharesAfterSplits = sharesOriginal * splitMult;

    // 3. Simulate dividend reinvestment
    const { extraShares, totalShares: sharesNow, divSummary } =
        simulateDRIP(year, sharesAfterSplits, aaplPriceUSD);

    // 4. Current portfolio value
    const valueUSD   = sharesNow * aaplPriceUSD;
    const fxNow      = fxRates[currency] ?? 1;
    const valueLocal = currency === 'USD' ? valueUSD : valueUSD * fxNow;

    // 5. Dividend contribution
    const valueNoDivUSD = sharesAfterSplits * aaplPriceUSD;
    const divBoostPct   = extraShares > 0
        ? ((valueUSD / valueNoDivUSD) - 1) * 100
        : 0;

    // 6. Total return on original USD investment
    const returnPct = ((valueUSD / pricePaidUSD) - 1) * 100;

    return {
        productName,
        year,
        localPrice,
        currency,
        aaplUSD,
        splitMult,
        historicalFX,
        sharesAfterSplits,
        extraShares,
        sharesNow,
        valueUSD,
        valueLocal,
        divBoostPct,
        returnPct,
        divSummary,
        aaplPriceUSD,
        aaplPriceDate,
        fxNow,
    };
}
