<?php
/**
 * AAPL Dividend Reinvestment Data
 *
 * Apple dividend history:
 *   Era 1  — 1987 Q3 through 1994 Q4 (suspended early 1995)
 *   Gap    — 1995 through 2011 (no dividend paid)
 *   Era 2  — 2012 Q3 onward (reinstated Aug 2012; growing annually since)
 *
 * All per-share amounts are split-adjusted to today's share count.
 * Era 1 pre-split amounts divided by cumulative split factor of 224.
 *
 * Era 1 original quarterly amounts (pre-split):
 *   1987–1990: $0.12/qtr  →  $0.000536 split-adjusted
 *   1991–1992: $0.08/qtr  →  $0.000357 split-adjusted
 *   1993–1994: $0.06/qtr  →  $0.000268 split-adjusted
 *
 * Era 2 quarterly dividends (per split-adjusted share, paid Feb/May/Aug/Nov):
 *   Source: Apple investor relations; split-adjusted for 2014 (7:1) and 2020 (4:1).
 */

// Era 1: 1987–1994 (quarterly, split-adjusted)
$era1 = [];
$era1_schedule = [
    1987 => 0.000536,
    1988 => 0.000536,
    1989 => 0.000536,
    1990 => 0.000536,
    1991 => 0.000357,
    1992 => 0.000357,
    1993 => 0.000268,
    1994 => 0.000268,
];
foreach ($era1_schedule as $year => $div_per_share) {
    foreach ([1, 2, 3, 4] as $quarter) {
        $era1[] = ['y' => $year, 'q' => $quarter, 'div' => $div_per_share];
    }
}

// Era 2: 2012 Q3 onward (quarterly, split-adjusted per share)
// Note: first payment was Q3 2012; Q4 2012 same rate before Jan 2013 increase
$era2_annual = [
    2012 => ['quarters' => [3, 4],      'div' => 0.0945],
    2013 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1088],
    2014 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1175],
    2015 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1300],
    2016 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1425],
    2017 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1575],
    2018 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1775],
    2019 => ['quarters' => [1, 2, 3, 4], 'div' => 0.1925],
    2020 => ['quarters' => [1, 2, 3, 4], 'div' => 0.2050],
    2021 => ['quarters' => [1, 2, 3, 4], 'div' => 0.2200],
    2022 => ['quarters' => [1, 2, 3, 4], 'div' => 0.2300],
    2023 => ['quarters' => [1, 2, 3, 4], 'div' => 0.2400],
    2024 => ['quarters' => [1, 2, 3, 4], 'div' => 0.2500],
    2025 => ['quarters' => [1, 2],       'div' => 0.2600],
];

$era2 = [];
foreach ($era2_annual as $year => $entry) {
    foreach ($entry['quarters'] as $quarter) {
        $era2[] = ['y' => $year, 'q' => $quarter, 'div' => $entry['div']];
    }
}

$dividend_schedule = array_merge($era1, $era2);

/**
 * Approximate split-adjusted AAPL closing price per quarter.
 * Used to convert reinvested dividend cash into additional shares.
 * Key format: "YYYY-Q"
 */
$quarterly_prices = [
    // Era 1: 1987–1994 (split-adjusted)
    '1987-1' => 0.35, '1987-2' => 0.40, '1987-3' => 0.42, '1987-4' => 0.26,
    '1988-1' => 0.25, '1988-2' => 0.26, '1988-3' => 0.28, '1988-4' => 0.30,
    '1989-1' => 0.32, '1989-2' => 0.38, '1989-3' => 0.42, '1989-4' => 0.44,
    '1990-1' => 0.38, '1990-2' => 0.35, '1990-3' => 0.28, '1990-4' => 0.28,
    '1991-1' => 0.30, '1991-2' => 0.32, '1991-3' => 0.33, '1991-4' => 0.35,
    '1992-1' => 0.36, '1992-2' => 0.38, '1992-3' => 0.37, '1992-4' => 0.34,
    '1993-1' => 0.30, '1993-2' => 0.26, '1993-3' => 0.22, '1993-4' => 0.20,
    '1994-1' => 0.18, '1994-2' => 0.16, '1994-3' => 0.15, '1994-4' => 0.18,
    // Era 2: 2012–2025 (split-adjusted)
    '2012-3' =>  19.0, '2012-4' =>  17.5,
    '2013-1' =>  16.0, '2013-2' =>  15.0, '2013-3' =>  16.5, '2013-4' =>  19.5,
    '2014-1' =>  19.0, '2014-2' =>  20.5, '2014-3' =>  24.0, '2014-4' =>  27.5,
    '2015-1' =>  30.0, '2015-2' =>  31.0, '2015-3' =>  28.0, '2015-4' =>  26.5,
    '2016-1' =>  23.5, '2016-2' =>  23.0, '2016-3' =>  26.5, '2016-4' =>  29.0,
    '2017-1' =>  35.0, '2017-2' =>  38.0, '2017-3' =>  38.5, '2017-4' =>  42.5,
    '2018-1' =>  42.0, '2018-2' =>  46.0, '2018-3' =>  56.0, '2018-4' =>  39.5,
    '2019-1' =>  45.0, '2019-2' =>  50.0, '2019-3' =>  55.5, '2019-4' =>  71.0,
    '2020-1' =>  57.0, '2020-2' =>  88.0, '2020-3' => 115.0, '2020-4' => 131.0,
    '2021-1' => 123.0, '2021-2' => 133.0, '2021-3' => 145.0, '2021-4' => 177.0,
    '2022-1' => 178.0, '2022-2' => 141.0, '2022-3' => 150.0, '2022-4' => 130.0,
    '2023-1' => 160.0, '2023-2' => 187.0, '2023-3' => 174.0, '2023-4' => 193.0,
    '2024-1' => 171.0, '2024-2' => 207.0, '2024-3' => 220.0, '2024-4' => 248.0,
    '2025-1' => 220.0, '2025-2' => 210.0,
];
