chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    targetLang: 'ja',
    sourceLang: 'auto',
    isEnabled: true
  });
  
  chrome.contextMenus.create({
    id: 'translateTweet',
    title: 'このツイートを翻訳',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateTweet') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'translateSelection'
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createContextMenu') {
    chrome.contextMenus.update('translateTweet', {
      title: `翻訳: "${request.text.substring(0, 20)}..."`
    });
  }
});