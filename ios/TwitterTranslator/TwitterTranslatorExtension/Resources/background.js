const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onInstalled.addListener(() => {
  api.storage.sync.get(['targetLang', 'sourceLang', 'isEnabled'], (result) => {
    const defaults = {};
    if (result.targetLang === undefined) defaults.targetLang = 'ja';
    if (result.sourceLang === undefined) defaults.sourceLang = 'auto';
    if (result.isEnabled === undefined) defaults.isEnabled = true;
    if (Object.keys(defaults).length > 0) {
      api.storage.sync.set(defaults);
    }
  });
});
