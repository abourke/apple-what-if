<?php
/**
 * aapl.php — server-side AAPL last-close price fetcher.
 *
 * Fetches from Yahoo Finance server-to-server (no CORS restriction).
 * Result is cached in a flat file for 1 hour so Yahoo is not hit on
 * every page load.
 *
 * Sets $aapl = ['price' => float, 'date' => string]
 * Falls back to hardcoded values if the fetch or cache fails.
 */

const AAPL_CACHE_FILE = __DIR__ . '/../cache/aapl.json';
const AAPL_CACHE_TTL  = 3600; // seconds (1 hour)
const AAPL_FALLBACK   = ['price' => 264.18, 'date' => 'Feb 27, 2026 (cached)'];

/**
 * Fetch AAPL last-close from Yahoo Finance.
 * @return array{price: float, date: string}|null  null on failure
 */
function fetch_aapl_from_yahoo(): ?array {
    $url = 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=5d';

    $ctx = stream_context_create([
        'http' => [
            'timeout'       => 5,
            'ignore_errors' => true,
            'header'        => "User-Agent: Mozilla/5.0\r\n",
        ],
        'ssl' => [
            'verify_peer'      => true,
            'verify_peer_name' => true,
        ],
    ]);

    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) return null;

    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) return null;

    $meta  = $data['chart']['result'][0]['meta'] ?? null;
    if (!$meta) return null;

    $price = (float) ($meta['chartPreviousClose'] ?? $meta['regularMarketPrice'] ?? 0);
    if ($price <= 0) return null;

    $ts   = (int) ($meta['regularMarketTime'] ?? time());
    $date = date('M j, Y', $ts);

    return ['price' => round($price, 2), 'date' => $date];
}

/**
 * Read cached AAPL data if it exists and is fresh.
 * @return array{price: float, date: string}|null
 */
function read_aapl_cache(): ?array {
    if (!file_exists(AAPL_CACHE_FILE)) return null;
    if ((time() - filemtime(AAPL_CACHE_FILE)) > AAPL_CACHE_TTL) return null;

    $raw = file_get_contents(AAPL_CACHE_FILE);
    if ($raw === false) return null;

    $data = json_decode($raw, true);
    return (is_array($data) && isset($data['price'], $data['date'])) ? $data : null;
}

/**
 * Write AAPL data to cache file.
 * Silently fails if the cache directory is not writable.
 */
function write_aapl_cache(array $data): void {
    $dir = dirname(AAPL_CACHE_FILE);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    @file_put_contents(AAPL_CACHE_FILE, json_encode($data));
}

// ── Resolve $aapl ─────────────────────────────────────────────────────────────

$aapl = read_aapl_cache();

if ($aapl === null) {
    $aapl = fetch_aapl_from_yahoo();

    if ($aapl !== null) {
        write_aapl_cache($aapl);
    } else {
        $aapl = AAPL_FALLBACK;
    }
}
