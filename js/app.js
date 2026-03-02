/**
 * app.js — application entry point and state management.
 *
 * Handles:
 *   - Live data initialisation (AAPL price, FX rates)
 *   - Currency switching
 *   - Product selection and custom calculation
 *   - URL state: encodes active product + currency as query params so any
 *     result is bookmarkable and shareable via a stable URL
 *   - Share button: copies the current URL to clipboard
 */

import { historicalData, products }          from './data.js';
import { initialise as initLiveData }        from './api.js';
import { calculate }                         from './calculator.js';
import {
    updateAaplBadge,
    updateRateNote,
    activateCurrencyButton,
    updateCurrencyLabels,
    buildProductGrid,
    showLoading,
    hideLoading,
    renderResult,
} from './ui.js';

// ── Application state ─────────────────────────────────────────────────────────

const state = {
    currency:           'USD',
    aaplPriceUSD:       null,
    aaplPriceDate:      '',
    fxRates:            { USD: 1, CAD: 1.44, GBP: 0.79, AUD: 1.62 },
    fxSource:           'cached',
    activeProductSlug:  null,
    activeCustomYear:   null,
    activeCustomPrice:  null,
};

// ── URL state ─────────────────────────────────────────────────────────────────

/**
 * Convert a product name to a URL-safe slug.
 * e.g. "MacBook Pro (1st gen)" -> "macbook-pro-1st-gen"
 */
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Find a product by its slug.
 */
function productFromSlug(slug) {
    return products.find(p => slugify(p.name) === slug) ?? null;
}

/**
 * Push the current calculation into the browser URL without a page reload.
 * Produces URLs like:
 *   ?product=iphone-1st-gen&currency=GBP
 *   ?year=2008&price=499&currency=CAD
 */
function pushUrlState(params) {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('currency', params.currency);
    if (params.type === 'product') {
        url.searchParams.set('product', params.slug);
    } else {
        url.searchParams.set('year',  params.year);
        url.searchParams.set('price', params.price);
    }
    history.pushState(null, '', url.toString());
}

/**
 * Read URL params and return a rehydration descriptor, or null if absent.
 */
function readUrlState() {
    const params   = new URLSearchParams(window.location.search);
    const currency = ['USD', 'CAD', 'GBP', 'AUD'].includes(params.get('currency'))
        ? params.get('currency')
        : null;

    if (params.has('product')) {
        return { type: 'product', slug: params.get('product'), currency: currency ?? 'USD' };
    }

    if (params.has('year') && params.has('price')) {
        const year  = parseInt(params.get('year'), 10);
        const price = parseFloat(params.get('price'));
        if (year > 0 && price > 0) {
            return { type: 'custom', year, price, currency: currency ?? 'USD' };
        }
    }

    return null;
}

// ── Currency switching ────────────────────────────────────────────────────────

function setCurrency(code) {
    state.currency = code;
    activateCurrencyButton(code);
    updateCurrencyLabels(code);
    updateRateNote(code, state.fxRates, state.fxSource);
    buildProductGrid(code, state.fxRates, onProductSelect, state.activeProductSlug);
    document.getElementById('result').style.display = 'none';
}

window.setCurrency = setCurrency;

// ── Product selection ─────────────────────────────────────────────────────────

function onProductSelect(product) {
    const slug = slugify(product.name);
    state.activeProductSlug = slug;
    state.activeCustomYear  = null;
    state.activeCustomPrice = null;
    pushUrlState({ type: 'product', slug, currency: state.currency });
    runCalculation(product.name, product.year, product.localPrice, state.currency);
}

// ── Custom calculator ─────────────────────────────────────────────────────────

function onCustomCalculate() {
    const year  = parseInt(document.getElementById('custom-year').value, 10);
    const price = parseFloat(document.getElementById('custom-price').value);

    if (!year || !price || price <= 0) {
        alert('Please select a year and enter a valid price.');
        return;
    }

    state.activeProductSlug = null;
    state.activeCustomYear  = year;
    state.activeCustomPrice = price;
    pushUrlState({ type: 'custom', year, price, currency: state.currency });

    document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
    runCalculation(`Custom purchase (${year})`, year, price, state.currency);
}

window.onCustomCalculate = onCustomCalculate;

// ── Share button ──────────────────────────────────────────────────────────────

function onShareResult() {
    const url = window.location.href;
    const btn = document.getElementById('share-btn');

    navigator.clipboard.writeText(url).then(() => {
        const label = btn.querySelector('.share-label');
        btn.classList.add('copied');
        label.textContent = 'Copied!';
        btn.setAttribute('aria-label', 'Link copied to clipboard');

        setTimeout(() => {
            btn.classList.remove('copied');
            label.textContent = 'Share';
            btn.setAttribute('aria-label', 'Copy shareable link to clipboard');
        }, 2000);
    }).catch(() => {
        // Fallback for non-HTTPS or clipboard-blocked environments
        prompt('Copy this link:', url);
    });
}

window.onShareResult = onShareResult;

// ── Core calculation flow ─────────────────────────────────────────────────────

function runCalculation(productName, year, localPrice, currency) {
    if (!state.aaplPriceUSD) {
        alert('AAPL price is still loading — please wait a moment.');
        return;
    }

    showLoading();

    setTimeout(() => {
        hideLoading();

        const result = calculate({
            productName,
            year,
            localPrice,
            currency,
            fxRates:       state.fxRates,
            aaplPriceUSD:  state.aaplPriceUSD,
            aaplPriceDate: state.aaplPriceDate,
        });

        renderResult(result);
    }, 400);
}

// ── Year dropdown ─────────────────────────────────────────────────────────────

function populateYearDropdown() {
    const select = document.getElementById('custom-year');
    Object.keys(historicalData)
        .map(Number)
        .sort((a, b) => b - a)
        .forEach(year => {
            const opt       = document.createElement('option');
            opt.value       = year;
            opt.textContent = year;
            select.appendChild(opt);
        });
}

// ── URL rehydration ───────────────────────────────────────────────────────────

/**
 * Restore UI state from URL params.
 * Called after live data is available so prices are accurate.
 */
function rehydrateFromUrl() {
    const saved = readUrlState();
    if (!saved) return;

    // Apply currency first if it differs
    if (saved.currency !== state.currency) {
        state.currency = saved.currency;
        activateCurrencyButton(saved.currency);
        updateCurrencyLabels(saved.currency);
        updateRateNote(saved.currency, state.fxRates, state.fxSource);
        buildProductGrid(saved.currency, state.fxRates, onProductSelect, null);
    }

    if (saved.type === 'product') {
        const product = productFromSlug(saved.slug);
        if (!product) return;

        const hasLocalPrice = product[saved.currency] !== null
            && product[saved.currency] !== undefined;
        const localPrice = hasLocalPrice ? product[saved.currency] : product.USD;

        state.activeProductSlug = saved.slug;

        // Highlight the matching product button
        document.querySelectorAll('.product-btn').forEach(btn => {
            const isMatch = btn.dataset.productName === product.name;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });

        runCalculation(product.name, product.year, localPrice, saved.currency);

    } else {
        state.activeCustomYear  = saved.year;
        state.activeCustomPrice = saved.price;
        document.getElementById('custom-year').value  = saved.year;
        document.getElementById('custom-price').value = saved.price;
        runCalculation(
            `Custom purchase (${saved.year})`,
            saved.year, saved.price, saved.currency
        );
    }
}

// ── Initialisation ────────────────────────────────────────────────────────────

async function init() {
    populateYearDropdown();
    buildProductGrid(state.currency, state.fxRates, onProductSelect, null);

    const liveData = await initLiveData();

    state.aaplPriceUSD  = liveData.aaplPriceUSD;
    state.aaplPriceDate = liveData.aaplPriceDate;
    state.fxRates       = liveData.fxRates;
    state.fxSource      = liveData.fxSource;

    updateAaplBadge(state.aaplPriceUSD, state.aaplPriceDate);
    updateRateNote(state.currency, state.fxRates, state.fxSource);

    // Rebuild with accurate live FX prices
    buildProductGrid(state.currency, state.fxRates, onProductSelect, state.activeProductSlug);

    // Restore any state encoded in the URL
    rehydrateFromUrl();
}

init();
