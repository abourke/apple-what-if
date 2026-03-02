<?php
/**
 * Apple product catalogue.
 *
 * Prices are official local launch prices, not FX conversions.
 * null = product not officially sold in that market at launch.
 *
 * USD is always present. CAD, GBP, AUD are local launch prices where known.
 */

$products = [
    ['name' => 'Apple I',                'year' => 1976, 'emoji' => '💾',
     'USD' => 666.66, 'CAD' => null,   'GBP' => null,   'AUD' => null],

    ['name' => 'Apple II',               'year' => 1977, 'emoji' => '🖥️',
     'USD' => 1298,   'CAD' => null,   'GBP' => null,   'AUD' => null],

    ['name' => 'Macintosh 128K',         'year' => 1984, 'emoji' => '🖱️',
     'USD' => 2495,   'CAD' => null,   'GBP' => 2495,   'AUD' => null],

    ['name' => 'Mac Plus',               'year' => 1986, 'emoji' => '🖥️',
     'USD' => 2599,   'CAD' => null,   'GBP' => 1999,   'AUD' => null],

    ['name' => 'Mac IIcx',               'year' => 1989, 'emoji' => '🖥️',
     'USD' => 5369,   'CAD' => 6299,   'GBP' => 3499,   'AUD' => null],

    ['name' => 'PowerBook 100',          'year' => 1991, 'emoji' => '💻',
     'USD' => 2500,   'CAD' => 2999,   'GBP' => 1999,   'AUD' => 3499],

    ['name' => 'Newton MessagePad',      'year' => 1993, 'emoji' => '📟',
     'USD' => 699,    'CAD' => 849,    'GBP' => 599,    'AUD' => 999],

    ['name' => 'Power Mac G3',           'year' => 1997, 'emoji' => '🖥️',
     'USD' => 1999,   'CAD' => 2699,   'GBP' => 1599,   'AUD' => 3199],

    ['name' => 'iMac G3',                'year' => 1998, 'emoji' => '🖥️',
     'USD' => 1299,   'CAD' => 1799,   'GBP' => 999,    'AUD' => 2199],

    ['name' => 'PowerBook G3',           'year' => 1998, 'emoji' => '💻',
     'USD' => 2299,   'CAD' => 3199,   'GBP' => 1799,   'AUD' => 3799],

    ['name' => 'iBook',                  'year' => 1999, 'emoji' => '💻',
     'USD' => 1599,   'CAD' => 2199,   'GBP' => 1299,   'AUD' => 2699],

    ['name' => 'Power Mac G4 Cube',      'year' => 2000, 'emoji' => '📦',
     'USD' => 1799,   'CAD' => 2499,   'GBP' => 1299,   'AUD' => 2999],

    ['name' => 'iPod (1st gen)',          'year' => 2001, 'emoji' => '🎵',
     'USD' => 399,    'CAD' => 599,    'GBP' => 399,    'AUD' => null],

    ['name' => 'iMac G4',                'year' => 2002, 'emoji' => '🖥️',
     'USD' => 1299,   'CAD' => 1899,   'GBP' => 1149,   'AUD' => 2499],

    ['name' => 'iPod mini',              'year' => 2004, 'emoji' => '🎵',
     'USD' => 249,    'CAD' => 329,    'GBP' => 199,    'AUD' => 399],

    ['name' => 'Mac mini (1st gen)',     'year' => 2005, 'emoji' => '🖥️',
     'USD' => 499,    'CAD' => 629,    'GBP' => 339,    'AUD' => 749],

    ['name' => 'MacBook Pro (1st gen)', 'year' => 2006, 'emoji' => '💻',
     'USD' => 1999,   'CAD' => 2499,   'GBP' => 1499,   'AUD' => 2999],

    ['name' => 'iPhone (1st gen)',       'year' => 2007, 'emoji' => '📱',
     'USD' => 499,    'CAD' => null,   'GBP' => null,   'AUD' => null],

    ['name' => 'MacBook Air (1st gen)', 'year' => 2008, 'emoji' => '💻',
     'USD' => 1799,   'CAD' => 1999,   'GBP' => 1199,   'AUD' => 2799],

    ['name' => 'iPhone 3GS',             'year' => 2009, 'emoji' => '📱',
     'USD' => 199,    'CAD' => 199,    'GBP' => 184,    'AUD' => null],

    ['name' => 'iPad (1st gen)',          'year' => 2010, 'emoji' => '📱',
     'USD' => 499,    'CAD' => 549,    'GBP' => 429,    'AUD' => 629],

    ['name' => 'iPhone 4S / Siri',       'year' => 2011, 'emoji' => '📱',
     'USD' => 199,    'CAD' => 199,    'GBP' => 499,    'AUD' => 799],

    ['name' => 'Retina MacBook Pro',     'year' => 2012, 'emoji' => '💻',
     'USD' => 2199,   'CAD' => 2299,   'GBP' => 1799,   'AUD' => 2999],

    ['name' => 'Mac Pro (Trash Can)',    'year' => 2013, 'emoji' => '🖥️',
     'USD' => 2999,   'CAD' => 3299,   'GBP' => 2499,   'AUD' => 3999],

    ['name' => 'iTunes: 100 songs',     'year' => 2003, 'emoji' => '🎶',
     'USD' => 99,     'CAD' => 132,    'GBP' => 79,     'AUD' => 165],

    ['name' => 'iPhone 6',               'year' => 2014, 'emoji' => '📱',
     'USD' => 299,    'CAD' => 349,    'GBP' => 599,    'AUD' => 999],

    ['name' => 'Apple Watch (1st gen)', 'year' => 2015, 'emoji' => '⌚',
     'USD' => 349,    'CAD' => 449,    'GBP' => 299,    'AUD' => 499],

    ['name' => 'AirPods (1st gen)',      'year' => 2016, 'emoji' => '🎧',
     'USD' => 159,    'CAD' => 219,    'GBP' => 159,    'AUD' => 229],

    ['name' => 'iMac Pro',               'year' => 2017, 'emoji' => '🖥️',
     'USD' => 4999,   'CAD' => 6299,   'GBP' => 4899,   'AUD' => 7299],

    ['name' => 'HomePod (1st gen)',      'year' => 2018, 'emoji' => '🔊',
     'USD' => 349,    'CAD' => 449,    'GBP' => 319,    'AUD' => 499],

    ['name' => 'Mac Pro (Cheese Grater)', 'year' => 2019, 'emoji' => '🖥️',
     'USD' => 5999,   'CAD' => 7499,   'GBP' => 5999,   'AUD' => 8999],

    ['name' => 'AirPods Max',            'year' => 2020, 'emoji' => '🎧',
     'USD' => 549,    'CAD' => 779,    'GBP' => 549,    'AUD' => 899],

    ['name' => 'Mac Studio',             'year' => 2022, 'emoji' => '🖥️',
     'USD' => 1999,   'CAD' => 2499,   'GBP' => 1999,   'AUD' => 2999],

    ['name' => 'AirTag 4-pack',          'year' => 2021, 'emoji' => '🏷️',
     'USD' => 99,     'CAD' => 129,    'GBP' => 99,     'AUD' => 149],

    ['name' => 'Vision Pro',             'year' => 2024, 'emoji' => '🥽',
     'USD' => 3499,   'CAD' => 4599,   'GBP' => 3499,   'AUD' => 5499],
];
