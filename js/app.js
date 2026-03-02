/**
 * app.js — application entry point and state management.
 *
 * Imports all other modules, initialises live data, and wires
 * user interactions to the calculator and UI renderer.
 */

import { historicalData }                    from './data.js';
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
    currency:       'USD',
    aaplPriceUSD:   null,
    aaplPriceDate:  '',
    fxRates:        { USD: 1, CAD: 1.44, GBP: 0.79, AUD: 1.62 },
    fxSource:       'cached',
};

// ── Currency switching ────────────────────────────────────────────────────────

function setCurrency(code) {
    state.currency = code;
    activateCurrencyButton(code);
    updateCurrencyLabels(code);
    updateRateNote(code, state.fxRates, state.fxSource);
    buildProductGrid(code, state.fxRates, onProductSelect);
    document.getElementById('result').style.display = 'none';
}

// Expose to onclick attributes in index.php
window.setCurrency = setCurrency;

// ── Product selection ─────────────────────────────────────────────────────────

function onProductSelect(product) {
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

    document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
    runCalculation(`Custom purchase (${year})`, year, price, state.currency);
}

window.onCustomCalculate = onCustomCalculate;

// ── Core calculation flow ─────────────────────────────────────────────────────

function runCalculation(productName, year, localPrice, currency) {
    if (!state.aaplPriceUSD) {
        alert('AAPL price is still loading — please wait a moment.');
        return;
    }

    showLoading();

    // Use setTimeout so the spinner paint has a chance to flush before
    // the (synchronous) calculation blocks the main thread briefly
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

// ── Year dropdown population ──────────────────────────────────────────────────

function populateYearDropdown() {
    const select = document.getElementById('custom-year');
    Object.keys(historicalData)
        .map(Number)
        .sort((a, b) => b - a)
        .forEach(year => {
            const opt = document.createElement('option');
            opt.value       = year;
            opt.textContent = year;
            select.appendChild(opt);
        });
}

// ── Initialisation ────────────────────────────────────────────────────────────

async function init() {
    // Render the product grid immediately with fallback FX rates
    // so the page is interactive before the network calls resolve
    populateYearDropdown();
    buildProductGrid(state.currency, state.fxRates, onProductSelect);

    // Fetch live data and update everything that depends on it
    const liveData = await initLiveData();

    state.aaplPriceUSD  = liveData.aaplPriceUSD;
    state.aaplPriceDate = liveData.aaplPriceDate;
    state.fxRates       = liveData.fxRates;
    state.fxSource      = liveData.fxSource;

    updateAaplBadge(state.aaplPriceUSD, state.aaplPriceDate);
    updateRateNote(state.currency, state.fxRates, state.fxSource);

    // Rebuild grid with accurate live prices
    buildProductGrid(state.currency, state.fxRates, onProductSelect);
}

init();
