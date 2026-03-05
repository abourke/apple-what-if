<?php
/**
 * index.php — application entry point.
 *
 * Loads all PHP data includes, serialises them to a JSON bridge block
 * for the JavaScript modules, then renders the HTML shell.
 *
 * Requirements: PHP 7.4+  |  Any standard web server with mod_rewrite or
 * equivalent (Apache, Nginx, Caddy).  No database or framework required.
 */

declare(strict_types=1);

require_once __DIR__ . '/includes/products.php';
require_once __DIR__ . '/includes/historical.php';
require_once __DIR__ . '/includes/dividends.php';
require_once __DIR__ . '/includes/luxuries.php';
require_once __DIR__ . '/includes/aapl.php';

// Encode all PHP data as JSON for the JS data bridge
$app_data_json = json_encode([
    'products'         => $products,
    'historicalData'   => $historical_data,
    'dividendSchedule' => $dividend_schedule,
    'quarterlyPrices'  => $quarterly_prices,
    'luxuries'         => $luxuries,
    'everyday'         => $everyday,
    'aaplPriceUSD'     => $aapl['price'],
    'aaplPriceDate'    => $aapl['date'],
], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What If You Bought AAPL Instead?</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap">

    <!-- Styles -->
    <link rel="stylesheet" href="css/style.css">

    <!-- Data bridge: PHP → JS (must precede module scripts) -->
    <script>window.APP_DATA = <?= $app_data_json ?>;</script>
</head>
<body>
<div class="container">

    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <header>
        <div class="header-top">
            <div class="header-eyebrow">The Opportunity Cost Calculator</div>
            <span id="aapl-badge">
                AAPL last close: <span class="price">fetching…</span>
            </span>
        </div>

        <h1>What if you'd bought <em>stock</em> instead?</h1>
        <p class="header-sub">
            Select your currency and an Apple product to discover what those
            dollars would be worth today if you'd bought AAPL shares on launch
            day instead.
        </p>

        <!-- Currency switcher -->
        <div class="currency-wrapper">
            <div class="currency-bar" role="group" aria-label="Select currency">
                <button class="cur-btn active" data-cur="USD" onclick="setCurrency('USD')" aria-pressed="true"  aria-label="US Dollar">🇺🇸 USD</button>
                <button class="cur-btn"         data-cur="CAD" onclick="setCurrency('CAD')" aria-pressed="false" aria-label="Canadian Dollar">🇨🇦 CAD</button>
                <button class="cur-btn"         data-cur="GBP" onclick="setCurrency('GBP')" aria-pressed="false" aria-label="British Pound">🇬🇧 GBP</button>
                <button class="cur-btn"         data-cur="AUD" onclick="setCurrency('AUD')" aria-pressed="false" aria-label="Australian Dollar">🇦🇺 AUD</button>
            </div>
            <span id="rate-note" aria-live="polite">Fetching live rates…</span>
        </div>
    </header>

    <!-- ── Products grid ───────────────────────────────────────────────────── -->
    <div class="section-label" id="product-section-label" aria-hidden="true">
        — Select a product · prices in $ (USD)
    </div>
    <div class="products-grid" id="products-grid" role="list" aria-label="Apple products"></div>

    <!-- Custom calculator -->
    <div class="custom-section" role="group" aria-label="Custom calculation">
        <div class="field-group">
            <label class="field-label" for="custom-year">Year</label>
            <select class="field-input" id="custom-year" aria-label="Select purchase year">
                <option value="">Select year…</option>
            </select>
        </div>
        <div class="field-group">
            <label class="field-label" for="custom-price" id="custom-price-label">
                Custom price (USD)
            </label>
            <input
                class="field-input"
                type="number"
                id="custom-price"
                placeholder="e.g. 499"
                min="1"
                aria-describedby="custom-price-label"
            >
        </div>
        <button class="calc-btn" onclick="onCustomCalculate()" aria-label="Calculate custom investment">Calculate →</button>
    </div>

    <!-- Loading indicator -->
    <div class="loading" id="loading" role="status" aria-live="polite" aria-label="Calculating">
        <span class="spinner" aria-hidden="true"></span>CALCULATING YOUR ALTERNATE TIMELINE…
    </div>

    <!-- ── Result panel ─────────────────────────────────────────────────────── -->
    <div id="result" aria-live="polite" aria-atomic="true">
        <div class="result-header">
            <div class="result-product-name" id="r-product-name"></div>
            <div class="result-headline">
                Your <span id="r-investment"></span> invested in AAPL<br>
                would be worth
                <span class="big-number" id="r-value"></span>
            </div>
            <button class="share-btn" id="share-btn" onclick="onShareResult()" aria-label="Copy shareable link to clipboard">
                <span class="share-icon" aria-hidden="true">↗</span>
                <span class="share-label">Share</span>
            </button>
        </div>

        <div class="stats-row" role="list" aria-label="Investment statistics">
            <div class="stat-cell" role="listitem">
                <div class="stat-label" id="label-shares">Shares after splits</div>
                <div class="stat-value" id="r-shares" aria-labelledby="label-shares"></div>
            </div>
            <div class="stat-cell" role="listitem">
                <div class="stat-label" id="label-shares-now">Shares incl. DRIP</div>
                <div class="stat-value" id="r-shares-now" aria-labelledby="label-shares-now"></div>
            </div>
            <div class="stat-cell" role="listitem">
                <div class="stat-label" id="label-return">Total return</div>
                <div class="stat-value green" id="r-return" aria-labelledby="label-return"></div>
            </div>
        </div>

        <p class="explainer" id="explainer"></p>

        <div class="luxuries-label" aria-hidden="true">— Instead, you could have bought…</div>
        <div class="luxuries-grid" id="luxuries-grid" role="list" aria-label="What you could buy instead — luxury and everyday items"></div>

        <div class="disclaimer" id="disclaimer" role="note"></div>
    </div>

</div><!-- /.container -->

<!-- Application modules (ES modules, deferred by default) -->
<script type="module" src="js/app.js"></script>
</body>
</html>
