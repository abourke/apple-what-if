# What If You Bought AAPL Instead?

> *The opportunity cost calculator nobody asked for but everyone needs.*

Pick any Apple product from 1976 to today, select your currency, and find out what that money would be worth if you'd bought AAPL shares on launch day instead — including stock splits and fully compounded dividend reinvestment.

---

## Features

- **33 Apple products** from the Apple I (1976) to Vision Pro (2024)
- **4 currencies** — USD, CAD, GBP, AUD — using real local launch prices, not FX conversions
- **Live AAPL price** fetched from Yahoo Finance on page load
- **Live exchange rates** from [Frankfurter](https://www.frankfurter.app/) (European Central Bank data, no API key required)
- **Accurate split history** — all 5 AAPL splits modelled (1987, 2000, 2005, 2014, 2020; cumulative ×224)
- **Year-by-year DRIP simulation** — quarterly dividend reinvestment across both Apple dividend eras (1987–1994 and 2012–present), compounded properly
- **70+ luxury item comparisons** — because raw numbers are less fun than knowing you could have bought a Bugatti
- **Custom calculator** — enter any year and price to run your own scenario

---

## Project Structure

```
apple-what-if/
├── index.php               # Entry point: PHP includes + HTML shell
├── css/
│   └── style.css           # All styles
├── includes/
│   ├── products.php        # Product catalogue with local launch prices
│   ├── historical.php      # Historical AAPL prices, split multipliers, FX rates
│   ├── dividends.php       # Dividend schedule + quarterly prices for DRIP
│   └── luxuries.php        # Luxury items catalogue
└── js/
    ├── data.js             # PHP → JS data bridge (re-exports window.APP_DATA)
    ├── api.js              # Live AAPL + FX rate fetching
    ├── calculator.js       # Pure calculation engine (no DOM dependencies)
    ├── ui.js               # All DOM rendering
    └── app.js              # App entry point, state, event wiring
```

---

## Setup

**Requirements:** PHP 7.4+, any standard web server (Apache, Nginx, Caddy).  
No database. No framework. No build step.

### Local development (PHP built-in server)

```bash
git clone https://github.com/abourke/apple-what-if.git
cd apple-what-if
php -S localhost:8000
```

Then open [http://localhost:8000](http://localhost:8000).

### Apache

Drop the folder in your web root. No `.htaccess` needed — `index.php` is the only entry point.

### Nginx

```nginx
server {
    listen 80;
    root /var/www/apple-what-if;
    index index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## How the Calculation Works

1. **Price → USD** — local launch price converted to USD at the historical exchange rate for that year
2. **Shares bought** — USD amount divided by split-adjusted AAPL price at time of purchase
3. **Splits applied** — cumulative split multiplier from purchase year to today
4. **DRIP simulation** — for each quarter Apple paid a dividend (1987–1994, 2012–present), dividend cash is reinvested at that quarter's approximate AAPL price, buying fractional shares that also earn future dividends
5. **Current value** — total shares × live AAPL price, converted to local currency at live rate

### Dividend eras

| Era | Period | Notes |
|-----|--------|-------|
| Era 1 | 1987 Q3 – 1994 Q4 | $0.06–$0.12/qtr pre-split (÷224 split-adjusted) |
| Gap | 1995 – 2011 | No dividend paid |
| Era 2 | 2012 Q3 – present | Reinstated Aug 2012; grown from $0.0945 to $0.26/qtr |

---

## Data Sources

| Data | Source |
|------|--------|
| Live AAPL price | [Yahoo Finance](https://finance.yahoo.com) |
| Live FX rates | [Frankfurter / ECB](https://www.frankfurter.app) |
| Historical AAPL prices | Split-adjusted from public records |
| Historical FX rates | Annual averages from public records |
| Product launch prices | Apple press releases, archived Apple Store pages |
| Dividend history | Apple Investor Relations |

---

## Notes & Caveats

- All calculations are estimates for entertainment purposes. Historical prices are approximate.
- Some iPhone prices shown are carrier-subsidised US contract prices (e.g. iPhone 3GS at $199, iPhone 4S at $199 USD/CAD); UK and Australian prices shown are unlocked.
- Products shown as dimmed in a given currency were not officially sold in that market at launch.
- Partial share purchases are fully supported — the AirTag 4-pack ($99 in 2021) bought 0.73 of a share.
- **Not financial advice.**

---

## License

MIT
