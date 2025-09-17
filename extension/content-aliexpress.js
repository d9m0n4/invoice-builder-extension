(function () {
  // function parseCartItems() {
  //   const items = [];

  //   document.querySelectorAll('[data-testid="productContainer"]').forEach((el) => {
  //     try {
  //       const nameEl = el.querySelector('[data-product-title]');
  //       const name = nameEl?.textContent?.trim() || 'Unknown Item';

  //       const priceEl = el.querySelector('[data-product-unformatted-price]');
  //       const price = priceEl
  //         ? parseFloat(priceEl.getAttribute('data-product-unformatted-price') || '0')
  //         : 0;

  //       const qtyEl = el.querySelector('[data-product-quantity]');
  //       const qty = qtyEl ? parseInt(qtyEl.getAttribute('data-product-quantity') || '1', 10) : 1;

  //       const origin = 'China';
  //       const weightKg = 0.3 * qty;
  //       const weightLbs = +(weightKg * 2.20462).toFixed(2);

  //       items.push({ name, qty, price, origin, weightKg, weightLbs });
  //     } catch (e) {
  //       console.error('Parse error:', e);
  //     }
  //   });

  //   return items;
  // }
  function parseCartItems() {
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
    });

    btn.addEventListener('click', () => {
      const items = parseCartItems();

      const productData = {
        items,
        seller: {
          company: 'My Dropshipping LLC',
          address: '1234 Main St, NY, USA',
          phone: '+1-555-123456',
          email: 'support@myshop.com',
        },
      };

      // Сохраняем в chrome.storage
      chrome.storage.local.set({ invoiceData: productData });

      // Открываем локальный React app с передачей данных через query string
      const dataStr = encodeURIComponent(JSON.stringify(productData));
      const url = `http://localhost:5173/?data=${dataStr}`;
      window.open(url, '_blank');
    });

    document.body.appendChild(btn);
  }

  window.addEventListener('load', injectButton);
})();
