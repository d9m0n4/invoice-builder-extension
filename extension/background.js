// background service worker (Manifest V3)
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'OPEN_INVOICE_APP') {
    const url = 'http://localhost:5173/create'; // локально при dev
    // Сохраним данные в chrome.storage и откроем вкладку
    chrome.storage.local.set({ invoiceData: msg.data }, () => {
      chrome.tabs.create({ url });
    });
  }
});

// debug helper
chrome.runtime.onInstalled.addListener(() => {
  console.log('Invoice Builder background installed');
});
