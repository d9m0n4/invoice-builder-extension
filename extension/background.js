// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_INVOICE_DATA') {
    chrome.storage.local.set({ invoiceData: message.payload }, () => {
      console.log('Saved in background');
      sendResponse({ success: true });
    });

    return true; // ⚠️ обязательно для async
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_INVOICE_APP') {
    const dataStr = encodeURIComponent(JSON.stringify(message.data));

    chrome.tabs.create({
      url: `http://localhost:5173/?data=${dataStr}&source=chrome-extension`,
    });

    sendResponse({ success: true });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Invoice Builder extension installed');
});
