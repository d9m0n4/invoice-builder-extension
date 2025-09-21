// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_INVOICE_APP') {
    const dataStr = encodeURIComponent(JSON.stringify(message.data));

    chrome.tabs.create({
      url: `http://invoice-builder-242.vercel.app/?data=${dataStr}&source=chrome-extension`,
    });

    sendResponse({ success: true });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Invoice Builder extension installed');
});
