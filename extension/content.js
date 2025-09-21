(function () {
  'use strict';

  function parseAliRU() {
    const items = [];

    document.querySelectorAll('[data-testid="productContainer"]').forEach((el) => {
      try {
        const nameEl = el.querySelector('[data-product-title]');
        const name = nameEl?.textContent?.trim() || 'Unknown Item';

        const priceEl = el.querySelector('[data-product-unformatted-price]');
        const price = priceEl
          ? parseFloat(priceEl.getAttribute('data-product-unformatted-price') || '0')
          : 0;

        const qtyEl = el.querySelector('[data-product-quantity]');
        const qty = qtyEl ? parseInt(qtyEl.getAttribute('data-product-quantity') || '1', 10) : 1;

        const origin = 'China';
        const weightKg = 0.3 * qty;
        const weightLbs = +(weightKg * 2.20462).toFixed(2);

        items.push({ name, qty, price, origin, weightKg, weightLbs });
      } catch (e) {
        console.error('Parse error:', e);
      }
    });

    return items;
  }

  function parseAliUSA() {
    const items = [];
    document.querySelectorAll('.cart-product.activity_cart_product').forEach((el) => {
      try {
        const nameEl = el.querySelector('.cart-product-name-title');
        const priceEl = el.querySelector('.cart-product-price-s');
        const qtyEl = el.querySelector('.comet-v2-input-number-input');

        const name = nameEl?.textContent?.trim() || 'Unknown Item';
        const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
        const qty = qtyEl ? parseInt(qtyEl.value, 10) : 1;

        const origin = 'China';
        const weightKg = 0.3 * qty;
        const weightLbs = +(weightKg * 2.20462).toFixed(2);

        items.push({ name, qty, price, origin, weightKg, weightLbs });
      } catch (e) {
        console.error('Parse error:', e);
      }
    });
    return items;
  }

  function parseEbay() {
    const items = [];
    document.querySelectorAll('.cart-bucket__vendor-list li').forEach((el) => {
      try {
        const nameEl = el.querySelector('.item-title a');
        const priceEl = el.querySelector('.item-price');
        const qtyEl = el.querySelector('[data-test-id="qty-dropdown"]');

        const name = nameEl?.textContent?.trim() || 'Unknown Item';
        const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
        const qty = qtyEl ? parseInt(qtyEl.value, 10) : 1;

        const origin = 'USA';
        const weightKg = 0.3 * qty;
        const weightLbs = +(weightKg * 2.20462).toFixed(2);

        items.push({ name, qty, price, origin, weightKg, weightLbs });
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
        const nameEl = el.querySelector('.sc-product-title');
        const priceEl = el.querySelector('.sc-product-price');
        const qtyEl = el.querySelector('.a-dropdown-prompt');

        const name = nameEl?.textContent?.trim() || 'Amazon Item';
        const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
        const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;

        const origin = 'USA';
        const weightKg = 0.3 * qty;
        const weightLbs = +(weightKg * 2.20462).toFixed(2);

        items.push({ name, qty, price, origin, weightKg, weightLbs });
      } catch (e) {
        console.error('Amazon parse error:', e);
      }
    });
    return items;
  }

  function getParser() {
    const hostname = window.location.hostname;

    if (hostname.includes('aliexpress.ru')) {
      return parseAliRU;
    } else if (hostname.includes('aliexpress.')) {
      return parseAliUSA;
    } else if (hostname.includes('ebay.')) {
      return parseEbay;
    } else if (hostname.includes('amazon.')) {
      return parseAmazon;
    }

    return () => [];
  }

  function getSiteType() {
    const hostname = window.location.hostname;

    if (hostname.includes('aliexpress.ru')) return 'aliexpress_ru';
    if (hostname.includes('aliexpress.')) return 'aliexpress_intl';
    if (hostname.includes('ebay.')) return 'ebay';
    if (hostname.includes('amazon.')) return 'amazon';

    return 'unknown';
  }

  function injectButton() {
    if (document.getElementById('invoice-builder-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'invoice-builder-btn';
    btn.innerText = 'Build Invoice';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
      padding: '10px 20px',
      background: '#ff4747',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    });

    btn.addEventListener('click', () => {
      const parser = getParser();
      const items = parser();
      const siteType = getSiteType();

      const productData = {
        items,
        siteType,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        seller: {
          companyName: 'My Dropshipping LLC',
          address: '1234 Main St, NY, USA',
          phone: '+1-555-123456',
          email: 'support@myshop.com',
          name: 'John Doe',
          title: 'Sales Manager',
        },
        buyer: {
          name: 'Customer Name',
          address: 'Customer Address',
          phone: 'Customer Phone',
        },
      };

      chrome.storage.local.set({ invoiceData: productData }, () => {
        console.log('Data saved to chrome.storage');
      });

      chrome.runtime.sendMessage(
        {
          type: 'OPEN_INVOICE_APP',
          data: productData,
        },
        (response) => {
          if (response.success) {
            console.log('Invoice app opened successfully');
          }
        },
      );
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#e03e3e';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ff4747';
    });

    document.body.appendChild(btn);

    const style = document.createElement('style');
    style.textContent = `
      #invoice-builder-btn:hover {
        background: #e03e3e !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      }
      
      #invoice-builder-btn:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  function hasProductsOnPage() {
    const hostname = window.location.hostname;

    if (hostname.includes('aliexpress')) {
      return (
        document.querySelectorAll('[data-testid="productContainer"], .cart-product').length > 0
      );
    }

    if (hostname.includes('ebay')) {
      return document.querySelectorAll('.cart-bucket__vendor-list li').length > 0;
    }

    if (hostname.includes('amazon')) {
      return document.querySelectorAll('.sc-list-item').length > 0;
    }

    return false;
  }

  function init() {
    if (hasProductsOnPage()) {
      injectButton();
    } else {
      const checkInterval = setInterval(() => {
        if (hasProductsOnPage()) {
          injectButton();
          clearInterval(checkInterval);
        }
      }, 1000);

      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  const observer = new MutationObserver((mutations) => {
    if (!document.getElementById('invoice-builder-btn') && hasProductsOnPage()) {
      injectButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
