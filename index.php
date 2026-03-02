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

// Encode all PHP data as JSON for the JS data bridge
$app_data_json = json_encode([
    'products'         => $products,
    'historicalData'   => $historical_data,
    'dividendSchedule' => $dividend_schedule,
    'quarterlyPrices'  => $quarterly_prices,
    'luxuries'         => $luxuries,
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
            <div class="currency-bar">
                <button class="cur-btn active" data-cur="USD" onclick="setCurrency('USD')">🇺🇸 USD</button>
                <button class="cur-btn"         data-cur="CAD" onclick="setCurrency('CAD')">🇨🇦 CAD</button>
                <button class="cur-btn"         data-cur="GBP" onclick="setCurrency('GBP')">🇬🇧 GBP</button>
                <button class="cur-btn"         data-cur="AUD" onclick="setCurrency('AUD')">🇦🇺 AUD</button>
            </div>
            <span id="rate-note">Fetching live rates…</span>
        </div>
    </header>

    <!-- ── Products grid ───────────────────────────────────────────────────── -->
    <div class="section-label" id="product-section-label">
        — Select a product · prices in $ (USD)
    </div>
    <div class="products-grid" id="products-grid"></div>

    <!-- Custom calculator -->
    <div class="custom-section">
        <div class="field-group">
            <label class="field-label" for="custom-year">Year</label>
            <select class="field-input" id="custom-year">
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
            >
        </div>
        <button class="calc-btn" onclick="onCustomCalculate()">Calculate →</button>
    </div>

    <!-- Loading indicator -->
    <div class="loading" id="loading">
        <span class="spinner"></span>CALCULATING YOUR ALTERNATE TIMELINE…
    </div>

    <!-- ── Result panel ─────────────────────────────────────────────────────── -->
    <div id="result">
        <div class="result-header">
            <div class="result-product-name" id="r-product-name"></div>
            <div class="result-headline">
                Your <span id="r-investment"></span> invested in AAPL<br>
                would be worth
                <span class="big-number" id="r-value"></span>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-cell">
                <div class="stat-label">Shares after splits</div>
                <div class="stat-value" id="r-shares"></div>
            </div>
            <div class="stat-cell">
                <div class="stat-label">Shares incl. DRIP</div>
                <div class="stat-value" id="r-shares-now"></div>
            </div>
            <div class="stat-cell">
                <div class="stat-label">Total return</div>
                <div class="stat-value green" id="r-return"></div>
            </div>
        </div>

        <div class="luxuries-label">— Instead, you could have bought…</div>
        <div class="luxuries-grid" id="luxuries-grid"></div>

        <div class="disclaimer" id="disclaimer"></div>
    </div>

</div><!-- /.container -->

<!-- Application modules (ES modules, deferred by default) -->
<script type="module" src="js/app.js"></script>
</body>
</html>
