chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeSeedPhrase') {
    chrome.storage.local.set({ seedPhrase: message.seedPhrase }, function() {
      console.log('Seed phrase is stored.');
      sendResponse({ success: true });
    });
    return true;
  } else if (message.action === 'getSeedPhrase') {
    chrome.storage.local.get('seedPhrase', function(result) {
      if (result.seedPhrase) {
        console.log('Seed phrase retrieved');
        sendResponse({ seedPhrase: result.seedPhrase });
      } else {
        console.log('No seed phrase found.');
        sendResponse({ seedPhrase: null });
      }
    });
    return true;
  } else if (message.action === 'clearSeedPhrase') {
    chrome.storage.local.remove('seedPhrase', function() {
      console.log('Seed phrase cleared.');
      sendResponse({ success: true });
    });
    return true;
  }
});
