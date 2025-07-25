const enableToggle = document.getElementById('enable-toggle');
const sourceLangSelect = document.getElementById('source-lang');
const targetLangSelect = document.getElementById('target-lang');
const statusDiv = document.getElementById('status');

chrome.storage.sync.get(['isEnabled', 'sourceLang', 'targetLang'], (result) => {
  enableToggle.checked = result.isEnabled !== false;
  sourceLangSelect.value = result.sourceLang || 'auto';
  targetLangSelect.value = result.targetLang || 'ja';
});

function showStatus() {
  statusDiv.classList.add('show');
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 2000);
}

enableToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ isEnabled: enableToggle.checked }, () => {
    showStatus();
  });
});

sourceLangSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ sourceLang: sourceLangSelect.value }, () => {
    showStatus();
  });
});

targetLangSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ targetLang: targetLangSelect.value }, () => {
    showStatus();
  });
});