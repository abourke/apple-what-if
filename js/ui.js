/**
 * ui.js — all DOM rendering.
 *
 * Imports the shared state object from app.js via passed arguments;
 * never reads or writes global state directly.
 */

import { CURRENCIES, products, luxuries, everyday } from './data.js';

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
        const isActive = btn.dataset.cur === currencyCode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
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
 * @param {string}      currencyCode
 * @param {object}      fxRates         — live rates, used as fallback for missing local prices
 * @param {function}    onSelect        — callback(product) when a product is clicked
 * @param {string|null} activeSlug      — slug of the currently selected product, if any
 */
export function buildProductGrid(currencyCode, fxRates, onSelect, activeSlug) {
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

        const slug    = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const isActive = slug === activeSlug;

        const btn = document.createElement('button');
        btn.className = `product-btn${notAvailable ? ' unavailable' : ''}${isActive ? ' active' : ''}`;
        btn.dataset.productName = product.name;
        btn.setAttribute('role', 'listitem');
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

        if (notAvailable) {
            btn.setAttribute('aria-disabled', 'true');
            btn.setAttribute('aria-label', `${product.name} (${product.year}) — not sold in this market at launch`);
        } else {
            btn.setAttribute('aria-label',
                `${product.name}, ${product.year}, ${fmtLocal(localPrice, currencyCode)}`);
        }

        btn.innerHTML = `
            <span class="p-name">${product.emoji} ${product.name}</span>
            <span class="p-year">${product.year}</span>
            <span class="${notAvailable ? 'p-na' : 'p-price'}" aria-hidden="true">
                ${notAvailable ? 'not sold here at launch' : fmtLocal(localPrice, currencyCode)}
            </span>
        `;

        if (!notAvailable) {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.product-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
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

    // Explainer
    renderExplainer(result);

    // Disclaimer
    renderDisclaimer({ result, sym, fxNow });

    // Reveal
    const panel = document.getElementById('result');
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Explainer ─────────────────────────────────────────────────────────────────

/**
 * Render a short plain-English paragraph explaining why the number is so large.
 * Uses the actual calculation values so it's always accurate per result.
 */
function renderExplainer(result) {
    const {
        year, productName, splitMult, sharesAfterSplits,
        extraShares, sharesNow, returnPct, divBoostPct,
    } = result;

    const yearsHeld  = new Date().getFullYear() - year;
    const splitYears = splitMult > 1
        ? `Apple split its stock ${Math.round(Math.log2(splitMult))} times since ${year}, turning every share into ${splitMult.toLocaleString()} — so your ${sharesAfterSplits.toFixed(1)} split-adjusted shares reflect that compounding.`
        : `No further splits have occurred since ${year}.`;

    const dripNote = extraShares > 0
        ? ` Apple's quarterly dividends — paid from 1987–1994 and again from 2012 onward — were reinvested each quarter to buy more shares, adding roughly ${Math.round(extraShares)} extra shares (${divBoostPct.toFixed(1)}% on top of the split gains).`
        : '';

    const growthNote = returnPct >= 10000
        ? `That's a return of over ${Math.round(returnPct / 1000).toLocaleString()},000% — the kind of growth that only compounds over ${yearsHeld} years of holding through crashes, booms, and everything in between.`
        : `That's a ${Math.round(returnPct).toLocaleString()}% return over ${yearsHeld} years.`;

    document.getElementById('explainer').innerHTML =
        `<strong>How is this possible?</strong> When you bought the ${productName} in ${year}, ` +
        `AAPL was a fraction of today's price. ${splitYears}${dripNote} ${growthNote} ` +
        `The number isn't a trick — it's what patient, uninterrupted compounding actually looks like.`;
}

// ── Luxuries + everyday items ─────────────────────────────────────────────────

function renderLuxuries(valueLocal, currency, fxNow, sym) {
    const grid = document.getElementById('luxuries-grid');
    grid.innerHTML = '';

    // Localise all items from both catalogues
    const localise = items => items.map(item => ({
        ...item,
        localPrice: currency === 'USD' ? item.price : item.price * fxNow,
    }));

    const allLuxury   = localise(luxuries);
    const allEveryday = localise(everyday);

    // Sort each catalogue by price descending so shuffle picks variety
    const sortDesc = arr => [...arr].sort((a, b) => b.localPrice - a.localPrice);

    // From luxury: prefer items the user can afford at least one of
    const affordableLuxury = sortDesc(allLuxury.filter(l => valueLocal >= l.localPrice));
    // From everyday: always include — shows scale even for small portfolios
    const affordableEveryday = sortDesc(allEveryday.filter(l => valueLocal >= l.localPrice));

    // Fisher-Yates shuffle
    const shuffle = arr => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    // Build a pool of 9: up to 6 luxury + up to 3 everyday, or fill gaps
    // with unaffordable items sorted cheapest-first for context
    let luxPool     = shuffle(affordableLuxury).slice(0, 6);
    let everydayPool = shuffle(affordableEveryday).slice(0, 3);

    // If we don't have enough affordable luxury items, pad with cheapest unaffordable
    if (luxPool.length < 6) {
        const unaffordable = sortDesc(allLuxury.filter(l => valueLocal < l.localPrice)).reverse();
        luxPool = [...luxPool, ...unaffordable].slice(0, 6);
    }

    // Same for everyday
    if (everydayPool.length < 3) {
        const unaffordable = sortDesc(allEveryday.filter(l => valueLocal < l.localPrice)).reverse();
        everydayPool = [...everydayPool, ...unaffordable].slice(0, 3);
    }

    // Interleave: 2 luxury, 1 everyday, 2 luxury, 1 everyday, 2 luxury, 1 everyday
    const pool = [
        luxPool[0], luxPool[1], everydayPool[0],
        luxPool[2], luxPool[3], everydayPool[1],
        luxPool[4], luxPool[5], everydayPool[2],
    ].filter(Boolean);

    pool.forEach(item => {
        const rawCount = valueLocal / item.localPrice;
        let countDisplay;
        if (rawCount >= 1) {
            countDisplay = Math.floor(rawCount).toLocaleString() + '×';
        } else {
            countDisplay = rawCount.toFixed(2) + '×';
        }

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.name + ' price')}`;

        const card = document.createElement('div');
        card.className = 'luxury-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label',
            `${countDisplay.replace('×', '')} ${item.name} at ${fmt(item.localPrice, sym)} each`);
        card.innerHTML = `
            <span class="luxury-emoji" aria-hidden="true">${item.emoji}</span>
            <div class="luxury-count" aria-hidden="true">${countDisplay}</div>
            <div class="luxury-item">
                <a href="${searchUrl}" target="_blank" rel="noopener noreferrer"
                   aria-label="Search Google for ${item.name} price"
                   onclick="event.stopPropagation()">${item.name}</a>
            </div>
            <div class="luxury-price">${fmt(item.localPrice, sym)} each</div>
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
