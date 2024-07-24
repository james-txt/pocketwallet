const algorithm = {
  name: "AES-GCM",
  length: 256
};

const generateKey = async () => {
  const key = await crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(exportedKey);
};

const importKey = async (keyData) => {
  return await crypto.subtle.importKey("raw", keyData, algorithm, false, ["encrypt", "decrypt"]);
};

const encryptData = async (data, key) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  const cipherKey = await importKey(key);
  const encrypted = await crypto.subtle.encrypt(
    { name: algorithm.name, iv },
    cipherKey,
    encoded
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
};

const decryptData = async (encryptedData, key) => {
  const { iv, data } = encryptedData;
  const cipherKey = await importKey(key);
  const decrypted = await crypto.subtle.decrypt(
    { name: algorithm.name, iv: new Uint8Array(iv) },
    cipherKey,
    new Uint8Array(data)
  );

  return new TextDecoder().decode(decrypted);
};

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        chrome.runtime.sendMessage({ action: 'retrieveSeedPhrase' });
      }
    }
  );
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeSeedPhrase') {
    (async () => {
      try {
        const key = await generateKey();
        const encryptedData = await encryptData(message.seedPhrase, key);

        chrome.storage.session.set({ seedPhrase: encryptedData, key: Array.from(key) }, () => {
          console.log('Seed phrase is stored.');
          sendResponse({ success: true });
        });
      } catch (error) {
        console.error('Error storing seed phrase:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Will respond asynchronously
  } else if (message.action === 'getSeedPhrase') {
    (async () => {
      try {
        chrome.storage.session.get(['seedPhrase', 'key'], async (result) => {
          if (result.seedPhrase && result.key) {
            const decryptedData = await decryptData(result.seedPhrase, new Uint8Array(result.key));
            console.log('Seed phrase retrieved');
            sendResponse({ seedPhrase: decryptedData });
          } else {
            console.log('No seed phrase found.');
            sendResponse({ seedPhrase: null });
          }
        });
      } catch (error) {
        console.error('Error retrieving seed phrase:', error);
        sendResponse({ seedPhrase: null, error: error.message });
      }
    })();
    return true; // Will respond asynchronously
  } else if (message.action === 'clearSeedPhrase') {
    chrome.storage.session.remove(['seedPhrase', 'key'], () => {
      console.log('Seed phrase cleared.');
      sendResponse({ success: true });
    });
    return true; // Will respond asynchronously
  } else if (message.action === 'retrieveSeedPhrase') {
    chrome.runtime.sendMessage({ action: 'getSeedPhrase' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving seed phrase:', chrome.runtime.lastError);
      } else if (response && response.seedPhrase) {
        console.log('Seed phrase retrieved:', response.seedPhrase);
        // Here you can trigger any necessary UI updates in your React app
      } else {
        console.log('No seed phrase found in storage.');
      }
    });
  }
});
