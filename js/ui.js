/**
 * ui.js — all DOM rendering.
 *
 * Imports the shared state object from app.js via passed arguments;
 * never reads or writes global state directly.
 */

import { CURRENCIES, products, luxuries } from './data.js';

// ── Formatting helpers ────────────────────────────────────────────────────────

/**
 * Format a number with currency symbol, abbreviating millions / billions.
 * @param {number} n
 * @param {string} symbol  e.g. '$', '£'
 * @returns {string}
 */
export function fmt(n, symbol = '$') {
    if (n >= 1e9) return `${symbol}${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${symbol}${(n / 1e6).toFixed(2)}M`;
    return `${symbol}${Math.round(n).toLocaleString()}`;
}

/**
 * Format a local-currency price using the active currency's symbol.
 * @param {number} value
 * @param {string} currencyCode
 * @returns {string}
 */
export function fmtLocal(value, currencyCode) {
    const { symbol } = CURRENCIES[currencyCode];
    return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

// ── Header badges ─────────────────────────────────────────────────────────────

/**
 * Update the AAPL price badge in the header.
 * @param {number} priceUSD
 * @param {string} dateStr
 */
export function updateAaplBadge(priceUSD, dateStr) {
    const el = document.getElementById('aapl-badge');
    el.innerHTML =
        `AAPL last close: <span class="price">$${priceUSD.toFixed(2)}</span>` +
        ` · ${dateStr} · Yahoo Finance`;
}

/**
 * Update the exchange-rate note beside the currency switcher.
 * @param {string} currencyCode
 * @param {object} fxRates
 * @param {'live'|'cached'} source
 */
export function updateRateNote(currencyCode, fxRates, source) {
    const el = document.getElementById('rate-note');

    if (currencyCode === 'USD') {
        el.textContent = '';
        return;
    }

    const { symbol } = CURRENCIES[currencyCode];
    const rate       = fxRates[currencyCode];
    const suffix     = source === 'live' ? '· Frankfurter / ECB' : '(cached rate)';
    el.textContent   = `1 USD = ${symbol}${rate.toFixed(4)} ${suffix}`;
}

// ── Currency switcher ─────────────────────────────────────────────────────────

/**
 * Mark the correct currency button as active.
 * @param {string} currencyCode
 */
export function activateCurrencyButton(currencyCode) {
    document.querySelectorAll('.cur-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cur === currencyCode);
    });
}

/**
 * Update the section label and custom-input label for the active currency.
 * @param {string} currencyCode
 */
export function updateCurrencyLabels(currencyCode) {
    const { symbol, code } = CURRENCIES[currencyCode];

    document.getElementById('product-section-label').textContent =
        `— Select a product · prices in ${symbol} (${code})`;

    document.getElementById('custom-price-label').textContent =
        `Custom price (${code})`;
}

// ── Products grid ─────────────────────────────────────────────────────────────

/**
 * Rebuild the products grid for the given currency.
 *
 * @param {string}   currencyCode
 * @param {object}   fxRates        — live rates, used as fallback for missing local prices
 * @param {function} onSelect       — callback(product) when a product is clicked
 */
export function buildProductGrid(currencyCode, fxRates, onSelect) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    // Display newest first
    const sorted = [...products].reverse();

    sorted.forEach(product => {
        const hasLocalPrice  = product[currencyCode] !== null && product[currencyCode] !== undefined;
        const notAvailable   = !hasLocalPrice && currencyCode !== 'USD';
        const localPrice     = hasLocalPrice
            ? product[currencyCode]
            : currencyCode === 'USD'
                ? product.USD
                : Math.round(product.USD * (fxRates[currencyCode] ?? 1));

        const btn = document.createElement('button');
        btn.className = `product-btn${notAvailable ? ' unavailable' : ''}`;
        btn.dataset.productName = product.name;

        btn.innerHTML = `
            <span class="p-name">${product.emoji} ${product.name}</span>
            <span class="p-year">${product.year}</span>
            <span class="${notAvailable ? 'p-na' : 'p-price'}">
                ${notAvailable ? 'not sold here at launch' : fmtLocal(localPrice, currencyCode)}
            </span>
        `;

        if (!notAvailable) {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onSelect({ ...product, localPrice, currency: currencyCode });
            });
        }

        grid.appendChild(btn);
    });
}

// ── Result panel ──────────────────────────────────────────────────────────────

/** Show the loading spinner, hide the result panel. */
export function showLoading() {
    document.getElementById('loading').classList.add('visible');
    document.getElementById('result').style.display = 'none';
}

/** Hide the loading spinner. */
export function hideLoading() {
    document.getElementById('loading').classList.remove('visible');
}

/**
 * Render the full result panel from a calculation result object.
 * @param {object} result  — as returned by calculator.calculate()
 */
export function renderResult(result) {
    const {
        productName, year, localPrice, currency,
        aaplUSD, splitMult, historicalFX,
        sharesAfterSplits, extraShares, sharesNow,
        valueLocal, divBoostPct, returnPct, divSummary,
        aaplPriceUSD, aaplPriceDate, fxNow,
    } = result;

    const sym = CURRENCIES[currency].symbol;

    // Headline
    document.getElementById('r-product-name').textContent = `— ${productName} (${year})`;
    document.getElementById('r-investment').textContent   = fmtLocal(localPrice, currency);
    document.getElementById('r-value').textContent        = fmt(valueLocal, sym);

    // Stats
    document.getElementById('r-shares').textContent    = sharesAfterSplits.toFixed(1);
    document.getElementById('r-shares-now').textContent = Math.round(sharesNow).toLocaleString();
    document.getElementById('r-return').textContent    =
        '+' + (returnPct >= 10000
            ? `${Math.round(returnPct / 1000).toLocaleString()},000%+`
            : `${Math.round(returnPct).toLocaleString()}%`);

    // Luxuries
    renderLuxuries(valueLocal, currency, fxNow, sym);

    // Disclaimer
    renderDisclaimer({ result, sym, fxNow });

    // Reveal
    const panel = document.getElementById('result');
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Luxuries ──────────────────────────────────────────────────────────────────

function renderLuxuries(valueLocal, currency, fxNow, sym) {
    const grid = document.getElementById('luxuries-grid');
    grid.innerHTML = '';

    // Convert all luxury prices to the active currency
    const localised = luxuries.map(l => ({
        ...l,
        localPrice: currency === 'USD' ? l.price : l.price * fxNow,
    }));

    // Prefer items the user can buy at least one of; pad with cheapest if needed
    const affordable = localised.filter(l => valueLocal >= l.localPrice);
    let pool = affordable.length >= 9
        ? affordable
        : [...localised].sort((a, b) => a.localPrice - b.localPrice).slice(0, 12);

    // Fisher-Yates shuffle for variety on each calculation
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    pool.slice(0, 9).forEach(lux => {
        const count = Math.floor(valueLocal / lux.localPrice);
        const card  = document.createElement('div');
        card.className = 'luxury-card';
        card.innerHTML = `
            <span class="luxury-emoji">${lux.emoji}</span>
            <div class="luxury-count">${count < 1 ? '<1' : count.toLocaleString()}×</div>
            <div class="luxury-item">${lux.name}</div>
            <div class="luxury-price">${fmt(lux.localPrice, sym)} each</div>
        `;
        grid.appendChild(card);
    });
}

// ── Disclaimer ────────────────────────────────────────────────────────────────

function renderDisclaimer({ result, sym, fxNow }) {
    const {
        year, currency, aaplUSD, splitMult, historicalFX,
        extraShares, divBoostPct, divSummary,
        aaplPriceUSD, aaplPriceDate,
    } = result;

    const fxNote = currency !== 'USD'
        ? ` Historical ${currency}/USD rate c.${year}: ≈${historicalFX.toFixed(3)}.` +
          ` Current live rate: 1 USD = ${sym}${fxNow.toFixed(4)} (Frankfurter/ECB).`
        : '';

    const divNote = extraShares > 0
        ? ` ${divSummary} Dividends added ${divBoostPct.toFixed(1)}% to final value vs splits-only.`
        : ` ${divSummary}`;

    document.getElementById('disclaimer').textContent =
        `Estimated calculation. AAPL ≈ $${aaplUSD.toFixed(2)} USD/share c.${year} (split-adjusted).` +
        ` Split multiplier from ${year}: ${splitMult}×.${divNote}${fxNote}` +
        ` AAPL last close: $${aaplPriceUSD.toFixed(2)} USD (${aaplPriceDate} · Yahoo Finance).` +
        ` Dimmed products were not officially sold in that market at launch.` +
        ` Luxury prices converted to ${currency} at today's live rate; approximate. Not financial advice.`;
}
