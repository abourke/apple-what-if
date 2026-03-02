<?php
/**
 * Historical data for AAPL calculations.
 *
 * Each year entry contains:
 *   aaplUSD   — split-adjusted AAPL price (USD) at approximate time of purchase
 *   splitMult — cumulative split multiplier from that year to today (post all 5 splits)
 *   fx        — approximate units of local currency per 1 USD at time of purchase
 *
 * Split history (AAPL):
 *   Jun 1987  2:1  | Dec 2000  2:1  | Feb 2005  2:1  | Jun 2014  7:1  | Aug 2020  4:1
 *   Cumulative from 1976 → today: ×224
 */

$historical_data = [
    1976 => ['aaplUSD' =>   0.50, 'splitMult' => 224, 'fx' => ['CAD' => 1.014, 'GBP' => 0.562, 'AUD' => 0.810]],
    1977 => ['aaplUSD' =>   0.50, 'splitMult' => 224, 'fx' => ['CAD' => 1.063, 'GBP' => 0.573, 'AUD' => 0.905]],
    1984 => ['aaplUSD' =>   1.25, 'splitMult' => 224, 'fx' => ['CAD' => 1.296, 'GBP' => 0.748, 'AUD' => 1.139]],
    1986 => ['aaplUSD' =>   0.50, 'splitMult' => 224, 'fx' => ['CAD' => 1.389, 'GBP' => 0.682, 'AUD' => 1.505]],
    1989 => ['aaplUSD' =>   1.62, 'splitMult' => 112, 'fx' => ['CAD' => 1.184, 'GBP' => 0.616, 'AUD' => 1.265]],
    1991 => ['aaplUSD' =>   1.30, 'splitMult' => 112, 'fx' => ['CAD' => 1.146, 'GBP' => 0.567, 'AUD' => 1.284]],
    1993 => ['aaplUSD' =>   1.05, 'splitMult' => 112, 'fx' => ['CAD' => 1.290, 'GBP' => 0.666, 'AUD' => 1.472]],
    1997 => ['aaplUSD' =>   0.60, 'splitMult' => 112, 'fx' => ['CAD' => 1.385, 'GBP' => 0.608, 'AUD' => 1.344]],
    1998 => ['aaplUSD' =>   1.20, 'splitMult' => 112, 'fx' => ['CAD' => 1.483, 'GBP' => 0.604, 'AUD' => 1.590]],
    1999 => ['aaplUSD' =>   2.20, 'splitMult' => 112, 'fx' => ['CAD' => 1.486, 'GBP' => 0.618, 'AUD' => 1.550]],
    2000 => ['aaplUSD' =>   3.80, 'splitMult' =>  56, 'fx' => ['CAD' => 1.485, 'GBP' => 0.661, 'AUD' => 1.718]],
    2001 => ['aaplUSD' =>   1.15, 'splitMult' =>  56, 'fx' => ['CAD' => 1.548, 'GBP' => 0.694, 'AUD' => 1.934]],
    2002 => ['aaplUSD' =>   1.40, 'splitMult' =>  56, 'fx' => ['CAD' => 1.570, 'GBP' => 0.667, 'AUD' => 1.841]],
    2003 => ['aaplUSD' =>   1.10, 'splitMult' =>  56, 'fx' => ['CAD' => 1.401, 'GBP' => 0.612, 'AUD' => 1.542]],
    2004 => ['aaplUSD' =>   1.35, 'splitMult' =>  56, 'fx' => ['CAD' => 1.301, 'GBP' => 0.546, 'AUD' => 1.360]],
    2005 => ['aaplUSD' =>   5.60, 'splitMult' =>  28, 'fx' => ['CAD' => 1.212, 'GBP' => 0.550, 'AUD' => 1.314]],
    2006 => ['aaplUSD' =>  10.50, 'splitMult' =>  28, 'fx' => ['CAD' => 1.134, 'GBP' => 0.543, 'AUD' => 1.328]],
    2007 => ['aaplUSD' =>  12.20, 'splitMult' =>  28, 'fx' => ['CAD' => 1.070, 'GBP' => 0.500, 'AUD' => 1.183]],
    2008 => ['aaplUSD' =>  17.00, 'splitMult' =>  28, 'fx' => ['CAD' => 1.060, 'GBP' => 0.505, 'AUD' => 1.059]],
    2009 => ['aaplUSD' =>  16.50, 'splitMult' =>  28, 'fx' => ['CAD' => 1.140, 'GBP' => 0.641, 'AUD' => 1.278]],
    2010 => ['aaplUSD' =>  27.50, 'splitMult' =>  28, 'fx' => ['CAD' => 1.030, 'GBP' => 0.647, 'AUD' => 1.030]],
    2011 => ['aaplUSD' =>  49.00, 'splitMult' =>  28, 'fx' => ['CAD' => 0.988, 'GBP' => 0.623, 'AUD' => 0.968]],
    2012 => ['aaplUSD' =>  80.00, 'splitMult' =>  28, 'fx' => ['CAD' => 0.999, 'GBP' => 0.630, 'AUD' => 0.967]],
    2013 => ['aaplUSD' =>  72.00, 'splitMult' =>  28, 'fx' => ['CAD' => 1.030, 'GBP' => 0.640, 'AUD' => 1.036]],
    2014 => ['aaplUSD' =>  21.00, 'splitMult' =>   4, 'fx' => ['CAD' => 1.104, 'GBP' => 0.607, 'AUD' => 1.110]],
    2015 => ['aaplUSD' =>  27.00, 'splitMult' =>   4, 'fx' => ['CAD' => 1.277, 'GBP' => 0.654, 'AUD' => 1.283]],
    2016 => ['aaplUSD' =>  28.00, 'splitMult' =>   4, 'fx' => ['CAD' => 1.325, 'GBP' => 0.741, 'AUD' => 1.345]],
    2017 => ['aaplUSD' =>  38.00, 'splitMult' =>   4, 'fx' => ['CAD' => 1.298, 'GBP' => 0.779, 'AUD' => 1.303]],
    2018 => ['aaplUSD' =>  52.00, 'splitMult' =>   4, 'fx' => ['CAD' => 1.287, 'GBP' => 0.754, 'AUD' => 1.352]],
    2019 => ['aaplUSD' =>  57.00, 'splitMult' =>   4, 'fx' => ['CAD' => 1.329, 'GBP' => 0.783, 'AUD' => 1.438]],
    2020 => ['aaplUSD' =>  31.00, 'splitMult' =>   1, 'fx' => ['CAD' => 1.340, 'GBP' => 0.768, 'AUD' => 1.468]],
    2021 => ['aaplUSD' => 135.00, 'splitMult' =>   1, 'fx' => ['CAD' => 1.260, 'GBP' => 0.722, 'AUD' => 1.363]],
    2022 => ['aaplUSD' => 180.00, 'splitMult' =>   1, 'fx' => ['CAD' => 1.294, 'GBP' => 0.803, 'AUD' => 1.438]],
    2023 => ['aaplUSD' => 145.00, 'splitMult' =>   1, 'fx' => ['CAD' => 1.350, 'GBP' => 0.788, 'AUD' => 1.505]],
    2024 => ['aaplUSD' => 190.00, 'splitMult' =>   1, 'fx' => ['CAD' => 1.370, 'GBP' => 0.790, 'AUD' => 1.530]],
];
