(function () {
  'use strict';

  /* =======================
     PRICE PARSER
  ======================= */

  function parsePrice(text) {
    if (!text) return null;

    const raw = text.trim();

    const symbols = {
      $: 'USD',
      '€': 'EUR',
      '₽': 'RUB',
      '£': 'GBP',
      '¥': 'JPY',
      '₴': 'UAH',
      '₸': 'KZT',
      '₺': 'TRY',
      '₪': 'ILS',
    };

    let currency = 'UNKNOWN';

    for (const s in symbols) {
      if (raw.includes(s)) {
        currency = symbols[s];
        break;
      }
    }

    if (currency === 'UNKNOWN') {
      const match = raw.match(/\b(USD|EUR|RUB|GBP|JPY)\b/i);
      if (match) currency = match[1].toUpperCase();
    }

    const value = parseFloat(
      raw
        .replace(/[^\d.,]/g, '')
        .replace(/\s/g, '')
        .replace(',', '.'),
    );

    return { value, currency, raw };
  }

  /* =======================
     PARSERS
  ======================= */

  function parseAliRU() {
    const items = [];

    document.querySelectorAll('[data-testid="productContainer"]').forEach((el) => {
      try {
        const name =
          el.querySelector('[data-product-title]')?.textContent?.trim() || 'Unknown Item';

        const priceValueEl = el.querySelector('[data-product-unformatted-price]');
        const valueRaw = priceValueEl?.getAttribute('data-product-unformatted-price');
        const value = valueRaw && Number.isFinite(Number(valueRaw)) ? Number(valueRaw) : null;

        const formattedEl = el.querySelector(
          '.SnowCartHotProductList_ProductPrice__formattedPrice__1wdy2',
        );
        const rawText = formattedEl?.textContent?.trim() || null;

        const price =
          value !== null
            ? {
                value,
                currency: 'RUB',
                raw: rawText ?? `${value} ₽`,
              }
            : null;

        const qty =
          parseInt(
            el.querySelector('[data-product-quantity]')?.getAttribute('data-product-quantity') ||
              '1',
            10,
          ) || 1;

        items.push({
          name,
          qty,
          price,
          origin: 'China',
          weightKg: 0.3 * qty,
          weightLbs: +(0.3 * qty * 2.20462).toFixed(2),
        });
      } catch (e) {
        console.error('Ali RU parse error:', e);
      }
    });

    return items;
  }

  function parseAliUSA() {
    const items = [];

    document.querySelectorAll('.cart-product.activity_cart_product').forEach((el) => {
      try {
        const name =
          el.querySelector('.cart-product-name-title')?.textContent?.trim() || 'Unknown Item';

        const priceEl = el.querySelector('.cart-product-price-s');
        const price = priceEl ? parsePrice(priceEl.textContent) : null;

        const qty =
          parseInt(el.querySelector('.comet-v2-input-number-input')?.value || '1', 10) || 1;

        items.push({
          name,
          qty,
          price,
          origin: 'China',
          weightKg: 0.3 * qty,
          weightLbs: +(0.3 * qty * 2.20462).toFixed(2),
        });
      } catch (e) {
        console.error('Ali Intl parse error:', e);
      }
    });

    return items;
  }

  function parseEbay() {
    const items = [];

    document.querySelectorAll('.cart-bucket__vendor-list li').forEach((el) => {
      try {
        const name = el.querySelector('.item-title a')?.textContent?.trim() || 'Unknown Item';

        const priceEl = el.querySelector('.item-price');
        const price = priceEl ? parsePrice(priceEl.textContent) : null;

        const qty =
          parseInt(el.querySelector('[data-test-id="qty-dropdown"]')?.value || '1', 10) || 1;

        items.push({
          name,
          qty,
          price,
          origin: 'USA',
          weightKg: 0.3 * qty,
          weightLbs: +(0.3 * qty * 2.20462).toFixed(2),
        });
      } catch (e) {
        console.error('eBay parse error:', e);
      }
    });

    return items;
  }

  function parseAmazon() {
    const items = [];

    document.querySelectorAll('.sc-list-item').forEach((el) => {
      try {
        const name = el.querySelector('.sc-product-title')?.textContent?.trim() || 'Amazon Item';

        const priceEl = el.querySelector('.sc-product-price');
        const price = priceEl ? parsePrice(priceEl.textContent) : null;

        const qty = parseInt(el.querySelector('.a-dropdown-prompt')?.textContent || '1', 10) || 1;

        items.push({
          name,
          qty,
          price,
          origin: 'USA',
          weightKg: 0.3 * qty,
          weightLbs: +(0.3 * qty * 2.20462).toFixed(2),
        });
      } catch (e) {
        console.error('Amazon parse error:', e);
      }
    });

    return items;
  }

  /* =======================
     HELPERS
  ======================= */

  function getParser() {
    const h = location.hostname;
    if (h.includes('aliexpress.ru')) return parseAliRU;
    if (h.includes('aliexpress.')) return parseAliUSA;
    if (h.includes('ebay.')) return parseEbay;
    if (h.includes('amazon.')) return parseAmazon;
    return () => [];
  }

  function getSiteType() {
    const h = location.hostname;
    if (h.includes('aliexpress.ru')) return 'aliexpress_ru';
    if (h.includes('aliexpress.')) return 'aliexpress_intl';
    if (h.includes('ebay.')) return 'ebay';
    if (h.includes('amazon.')) return 'amazon';
    return 'unknown';
  }

  /* =======================
     UI
  ======================= */

  function injectButton() {
    if (document.getElementById('invoice-builder-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'invoice-builder-btn';
    btn.textContent = 'Build Invoice';

    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      padding: '10px 20px',
      background: '#ff4747',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    });

    btn.onclick = () => {
      const items = getParser()();
      const data = {
        items,
        siteType: getSiteType(),
        url: location.href,
        timestamp: new Date().toISOString(),
      };

      chrome.runtime.sendMessage({ type: 'SAVE_INVOICE_DATA', payload: data });
      chrome.runtime.sendMessage({ type: 'OPEN_INVOICE_APP', data });
    };

    document.body.appendChild(btn);
  }

  function hasProductsOnPage() {
    const h = location.hostname;
    if (h.includes('aliexpress'))
      return document.querySelectorAll('[data-testid="productContainer"], .cart-product').length;
    if (h.includes('ebay')) return document.querySelectorAll('.cart-bucket__vendor-list li').length;
    if (h.includes('amazon')) return document.querySelectorAll('.sc-list-item').length;
    return false;
  }

  function init() {
    if (hasProductsOnPage()) injectButton();
    else {
      const i = setInterval(() => {
        if (hasProductsOnPage()) {
          injectButton();
          clearInterval(i);
        }
      }, 1000);
      setTimeout(() => clearInterval(i), 10000);
    }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

  new MutationObserver(() => {
    if (!document.getElementById('invoice-builder-btn') && hasProductsOnPage()) {
      injectButton();
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
