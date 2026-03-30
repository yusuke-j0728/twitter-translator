const api = typeof browser !== 'undefined' ? browser : chrome;

const enableToggle = document.getElementById('enable-toggle');
const sourceLangSelect = document.getElementById('source-lang');
const targetLangSelect = document.getElementById('target-lang');
const statusDiv = document.getElementById('status');

api.storage.sync.get(['isEnabled', 'sourceLang', 'targetLang'], (result) => {
  enableToggle.checked = result.isEnabled !== false;
  sourceLangSelect.value = result.sourceLang || 'auto';
  targetLangSelect.value = result.targetLang || 'en';
});

function showStatus() {
  statusDiv.classList.add('show');
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 2000);
}

enableToggle.addEventListener('change', () => {
  api.storage.sync.set({ isEnabled: enableToggle.checked }, () => {
    showStatus();
  });
});

sourceLangSelect.addEventListener('change', () => {
  api.storage.sync.set({ sourceLang: sourceLangSelect.value }, () => {
    showStatus();
  });
});

targetLangSelect.addEventListener('change', () => {
  api.storage.sync.set({ targetLang: targetLangSelect.value }, () => {
    showStatus();
  });
});
