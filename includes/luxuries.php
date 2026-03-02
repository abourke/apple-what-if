<?php
/**
 * Luxury items catalogue.
 * Prices in USD; converted to local currency at display time using live FX rates.
 */

$luxuries = [
    ['name' => 'Lamborghini Diablo SV',              'price' => 275000,    'emoji' => '🏎️'],
    ['name' => 'Lamborghini Urus',                   'price' => 230000,    'emoji' => '🏎️'],
    ['name' => 'Ferrari 488 GTB',                    'price' => 280000,    'emoji' => '🏎️'],
    ['name' => 'Ferrari LaFerrari',                  'price' => 1400000,   'emoji' => '🏎️'],
    ['name' => 'McLaren P1',                         'price' => 1150000,   'emoji' => '🏎️'],
    ['name' => 'McLaren 720S',                       'price' => 300000,    'emoji' => '🏎️'],
    ['name' => 'Rolls-Royce Phantom VIII',           'price' => 460000,    'emoji' => '🚗'],
    ['name' => 'Rolls-Royce Cullinan',               'price' => 340000,    'emoji' => '🚗'],
    ['name' => 'Bentley Bentayga',                   'price' => 230000,    'emoji' => '🚗'],
    ['name' => 'Bentley Continental GT',             'price' => 215000,    'emoji' => '🚗'],
    ['name' => 'Bugatti Chiron',                     'price' => 3200000,   'emoji' => '🚗'],
    ['name' => 'Bugatti Veyron',                     'price' => 1700000,   'emoji' => '🚗'],
    ['name' => 'Porsche 911 GT3 RS',                 'price' => 230000,    'emoji' => '🏎️'],
    ['name' => 'Porsche Taycan Turbo S',             'price' => 190000,    'emoji' => '🚗'],
    ['name' => 'Aston Martin DBS',                   'price' => 320000,    'emoji' => '🚗'],
    ['name' => 'Koenigsegg Jesko',                   'price' => 2800000,   'emoji' => '🏎️'],
    ['name' => 'Mercedes-AMG G63',                   'price' => 175000,    'emoji' => '🚙'],
    ['name' => 'Pagani Huayra',                      'price' => 2600000,   'emoji' => '🏎️'],
    ['name' => 'Rimac Nevera',                       'price' => 2400000,   'emoji' => '🏎️'],
    ['name' => 'Tesla Roadster',                     'price' => 200000,    'emoji' => '🚗'],
    ['name' => 'Patek Philippe Nautilus 5711',       'price' => 105000,    'emoji' => '⌚'],
    ['name' => 'Patek Philippe Grand Complication',  'price' => 750000,    'emoji' => '⌚'],
    ['name' => 'Rolex Daytona (steel)',              'price' => 35000,     'emoji' => '⌚'],
    ['name' => 'Rolex Submariner',                   'price' => 14000,     'emoji' => '⌚'],
    ['name' => 'Audemars Piguet Royal Oak',          'price' => 85000,     'emoji' => '⌚'],
    ['name' => 'Richard Mille RM 011',               'price' => 195000,    'emoji' => '⌚'],
    ['name' => 'Richard Mille RM 69',                'price' => 980000,    'emoji' => '⌚'],
    ['name' => 'F.P. Journe Tourbillon Souverain',   'price' => 480000,    'emoji' => '⌚'],
    ['name' => 'A. Lange & Söhne Zeitwerk',          'price' => 95000,     'emoji' => '⌚'],
    ['name' => 'Vacheron Constantin Traditionnelle', 'price' => 120000,    'emoji' => '⌚'],
    ['name' => 'Jaeger-LeCoultre Reverso',           'price' => 22000,     'emoji' => '⌚'],
    ['name' => 'Monaco penthouse (1-bed)',            'price' => 4500000,   'emoji' => '🏙️'],
    ['name' => 'Miami Beach luxury condo',            'price' => 2200000,   'emoji' => '🏖️'],
    ['name' => 'Manhattan studio apartment',         'price' => 1100000,   'emoji' => '🏙️'],
    ['name' => 'Paris Marais pied-à-terre',          'price' => 1800000,   'emoji' => '🗼'],
    ['name' => 'Tuscany villa (5-bed)',              'price' => 3200000,   'emoji' => '🏡'],
    ['name' => 'Aspen ski chalet',                   'price' => 8500000,   'emoji' => '⛷️'],
    ['name' => 'Malibu beach house',                 'price' => 12000000,  'emoji' => '🌊'],
    ['name' => 'London Mayfair townhouse',           'price' => 9500000,   'emoji' => '🇬🇧'],
    ['name' => 'Singapore bungalow (GCB)',           'price' => 35000000,  'emoji' => '🌴'],
    ['name' => 'Santorini cliff villa',              'price' => 4800000,   'emoji' => '🇬🇷'],
    ['name' => 'Napa Valley vineyard (5 ac)',        'price' => 2000000,   'emoji' => '🍷'],
    ['name' => 'Private island (Caribbean)',         'price' => 18000000,  'emoji' => '🏝️'],
    ['name' => 'Private jet hour (G650)',            'price' => 12000,     'emoji' => '✈️'],
    ['name' => 'Superyacht week (60m)',              'price' => 350000,    'emoji' => '⛵'],
    ['name' => 'Business class RTW trip',            'price' => 28000,     'emoji' => '🌍'],
    ['name' => 'Maldives overwater villa wk',        'price' => 35000,     'emoji' => '🌊'],
    ['name' => 'Suborbital spaceflight',             'price' => 450000,    'emoji' => '🚀'],
    ['name' => 'ISS tourist mission',                'price' => 55000000,  'emoji' => '🛸'],
    ['name' => 'Antarctic expedition (luxury)',      'price' => 95000,     'emoji' => '🧊'],
    ['name' => 'Aman Tokyo suite (week)',            'price' => 42000,     'emoji' => '🏯'],
    ['name' => 'African safari, top lodge wk',       'price' => 65000,     'emoji' => '🦁'],
    ['name' => 'F1 paddock club weekend',            'price' => 18000,     'emoji' => '🏁'],
    ['name' => 'Super Bowl suite (8 guests)',         'price' => 500000,    'emoji' => '🏈'],
    ['name' => 'Hermès Birkin 35 (gold HW)',         'price' => 12000,     'emoji' => '👜'],
    ['name' => 'Hermès Himalayan Birkin',            'price' => 300000,    'emoji' => '👜'],
    ['name' => 'Chanel Couture gown',                'price' => 95000,     'emoji' => '👗'],
    ['name' => 'Bespoke Savile Row suit',            'price' => 8000,      'emoji' => '🎩'],
    ['name' => 'Banksy original canvas',             'price' => 1200000,   'emoji' => '🎨'],
    ['name' => 'Basquiat painting (mid-tier)',        'price' => 4500000,   'emoji' => '🎨'],
    ['name' => 'Warhol screenprint (signed)',         'price' => 750000,    'emoji' => '🎨'],
    ['name' => 'Rare wine cellar (1,000 btl)',       'price' => 500000,    'emoji' => '🍾'],
    ['name' => 'Château Pétrus case (12)',           'price' => 65000,     'emoji' => '🍷'],
    ['name' => 'Gulfstream G700 (fraction)',         'price' => 3500000,   'emoji' => '✈️'],
    ['name' => 'Custom 40ft sailing yacht',          'price' => 1200000,   'emoji' => '⛵'],
    ['name' => 'Sunseeker 76 Yacht',                 'price' => 2400000,   'emoji' => '🛥️'],
    ['name' => 'Robinson R66 helicopter',            'price' => 950000,    'emoji' => '🚁'],
    ['name' => 'Steinway Model D concert grand',     'price' => 180000,    'emoji' => '🎹'],
    ['name' => 'Hollywood Hills home studio',        'price' => 3000000,   'emoji' => '🎙️'],
];

/**
 * Everyday consumer items catalogue.
 * Prices in USD; converted to local currency at display time.
 * Included in the "what you could buy instead" pool alongside luxury items,
 * providing relatable scale for smaller investment results.
 */
$everyday = [
    // Food & drink
    ['name' => 'Big Mac',                            'price' => 5.29,      'emoji' => '🍔'],
    ['name' => 'Starbucks latte',                    'price' => 7.00,      'emoji' => '☕'],
    ['name' => 'Dozen eggs',                         'price' => 4.50,      'emoji' => '🥚'],
    ['name' => 'Loaf of bread',                      'price' => 4.00,      'emoji' => '🍞'],
    ['name' => 'Litre of milk',                      'price' => 1.50,      'emoji' => '🥛'],
    ['name' => 'Avocado toast (café)',               'price' => 14.00,     'emoji' => '🥑'],
    ['name' => 'Large pizza (delivery)',             'price' => 22.00,     'emoji' => '🍕'],
    ['name' => 'Case of beer (24)',                  'price' => 28.00,     'emoji' => '🍺'],
    ['name' => 'Bottle of decent wine',              'price' => 20.00,     'emoji' => '🍷'],
    ['name' => 'Weekly groceries (1 person)',        'price' => 100.00,    'emoji' => '🛒'],
    ['name' => 'Restaurant dinner for two',         'price' => 120.00,    'emoji' => '🍽️'],

    // Subscriptions & services
    ['name' => 'Netflix (month)',                    'price' => 22.99,     'emoji' => '📺'],
    ['name' => 'Spotify (month)',                    'price' => 11.99,     'emoji' => '🎵'],
    ['name' => 'iCloud 2TB (month)',                 'price' => 9.99,      'emoji' => '☁️'],
    ['name' => 'NY Times subscription (year)',       'price' => 119.00,    'emoji' => '📰'],
    ['name' => 'Amazon Prime (year)',                'price' => 139.00,    'emoji' => '📦'],
    ['name' => 'Gym membership (month)',             'price' => 50.00,     'emoji' => '🏋️'],

    // Household
    ['name' => 'Roll of paper towels (12pk)',       'price' => 22.00,     'emoji' => '🧻'],
    ['name' => 'Tide Pods (81ct)',                   'price' => 22.00,     'emoji' => '🧺'],
    ['name' => 'IKEA Billy bookcase',               'price' => 79.00,     'emoji' => '📚'],
    ['name' => 'Dyson V8 vacuum',                   'price' => 350.00,    'emoji' => '🧹'],
    ['name' => 'KitchenAid stand mixer',            'price' => 450.00,    'emoji' => '🍰'],
    ['name' => 'Le Creuset dutch oven',             'price' => 420.00,    'emoji' => '🍲'],
    ['name' => 'Instant Pot (8qt)',                  'price' => 100.00,    'emoji' => '🥘'],
    ['name' => 'Nespresso machine',                 'price' => 180.00,    'emoji' => '☕'],

    // Transport
    ['name' => 'Tank of gas (50L)',                  'price' => 65.00,     'emoji' => '⛽'],
    ['name' => 'Monthly transit pass',               'price' => 100.00,    'emoji' => '🚌'],
    ['name' => 'Uber across town',                   'price' => 18.00,     'emoji' => '🚗'],
    ['name' => 'Economy flight (domestic)',          'price' => 280.00,    'emoji' => '✈️'],

    // Health & personal
    ['name' => 'Prescription (30-day supply)',      'price' => 30.00,     'emoji' => '💊'],
    ['name' => 'Haircut',                            'price' => 35.00,     'emoji' => '💈'],
    ['name' => 'Massage (60 min)',                   'price' => 90.00,     'emoji' => '💆'],

    // Entertainment
    ['name' => 'Movie ticket',                       'price' => 15.00,     'emoji' => '🎬'],
    ['name' => 'Paperback novel',                    'price' => 18.00,     'emoji' => '📖'],
    ['name' => 'Video game (new release)',           'price' => 79.99,     'emoji' => '🎮'],
    ['name' => 'Concert ticket (mid-tier)',          'price' => 150.00,    'emoji' => '🎤'],
];

