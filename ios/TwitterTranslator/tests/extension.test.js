/**
 * Tests for Twitter Translator Safari Web Extension (iOS)
 * Validates the Safari-adapted extension files
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  \u2713 ${message}`);
  } else {
    failed++;
    console.error(`  \u2717 ${message}`);
  }
}

const resourcesDir = path.join(__dirname, '..', 'TwitterTranslatorExtension', 'Resources');
const contentJs = fs.readFileSync(path.join(resourcesDir, 'content.js'), 'utf8');
const popupJs = fs.readFileSync(path.join(resourcesDir, 'popup.js'), 'utf8');
const popupHtml = fs.readFileSync(path.join(resourcesDir, 'popup.html'), 'utf8');
const backgroundJs = fs.readFileSync(path.join(resourcesDir, 'background.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(resourcesDir, 'manifest.json'), 'utf8'));
const stylesCss = fs.readFileSync(path.join(resourcesDir, 'styles.css'), 'utf8');

// ============================================================
// Test 1: Browser API compatibility
// ============================================================
console.log('\n[Test] Safari browser API compatibility');

assert(
  contentJs.includes("typeof browser !== 'undefined' ? browser : chrome"),
  'content.js: uses browser/chrome API fallback'
);

assert(
  popupJs.includes("typeof browser !== 'undefined' ? browser : chrome"),
  'popup.js: uses browser/chrome API fallback'
);

assert(
  backgroundJs.includes("typeof browser !== 'undefined' ? browser : chrome"),
  'background.js: uses browser/chrome API fallback'
);

assert(
  !contentJs.includes('chrome.storage') && contentJs.includes('api.storage'),
  'content.js: uses api variable instead of chrome directly'
);

// ============================================================
// Test 2: Manifest is valid for Safari
// ============================================================
console.log('\n[Test] Manifest configuration for Safari');

assert(
  manifest.manifest_version === 3,
  'manifest.json: uses Manifest V3'
);

assert(
  manifest.host_permissions.includes('https://mobile.twitter.com/*'),
  'manifest.json: includes mobile.twitter.com in host_permissions'
);

assert(
  manifest.host_permissions.includes('https://mobile.x.com/*'),
  'manifest.json: includes mobile.x.com in host_permissions'
);

assert(
  manifest.content_scripts[0].matches.includes('https://mobile.twitter.com/*'),
  'manifest.json: content script matches mobile.twitter.com'
);

assert(
  manifest.background.service_worker === 'background.js',
  'manifest.json: background service_worker is set'
);

assert(
  !manifest.permissions.includes('contextMenus'),
  'manifest.json: no contextMenus (not supported on iOS Safari)'
);

// ============================================================
// Test 3: Toggle switch fix is present
// ============================================================
console.log('\n[Test] Toggle switch uses <label>');

assert(
  popupHtml.includes('<label class="toggle-switch">'),
  'popup.html: toggle-switch uses <label> element'
);

assert(
  !popupHtml.match(/<div class="toggle-switch">/),
  'popup.html: no <div class="toggle-switch"> present'
);

// ============================================================
// Test 4: Settings persistence fix is present
// ============================================================
console.log('\n[Test] background.js preserves existing settings');

assert(
  backgroundJs.includes('api.storage.sync.get('),
  'background.js: reads existing settings before setting defaults'
);

assert(
  backgroundJs.includes('=== undefined'),
  'background.js: only sets defaults for undefined values'
);

// ============================================================
// Test 5: Language change retranslation fix is present
// ============================================================
console.log('\n[Test] Language change triggers retranslation');

assert(
  contentJs.includes('langChanged'),
  'content.js: tracks language change flag'
);

assert(
  contentJs.includes('else if (langChanged && isEnabled)'),
  'content.js: retranslates on language change when enabled'
);

// ============================================================
// Test 6: Content script does not use contextmenu (iOS)
// ============================================================
console.log('\n[Test] No context menu code in iOS content script');

assert(
  !contentJs.includes('contextmenu'),
  'content.js: no contextmenu event listener (not applicable on iOS)'
);

assert(
  !contentJs.includes('createContextMenu'),
  'content.js: no createContextMenu message'
);

// ============================================================
// Test 7: Mobile-friendly styles
// ============================================================
console.log('\n[Test] Mobile-friendly CSS');

assert(
  stylesCss.includes('touch-action: manipulation'),
  'styles.css: toggle button has touch-action: manipulation'
);

assert(
  stylesCss.includes('min-width: 32px') && stylesCss.includes('min-height: 32px'),
  'styles.css: toggle button has minimum tap target size (32px)'
);

assert(
  stylesCss.includes('-webkit-tap-highlight-color'),
  'styles.css: disables webkit tap highlight'
);

// ============================================================
// Test 8: Popup has dark mode support
// ============================================================
console.log('\n[Test] Popup dark mode support');

assert(
  popupHtml.includes('prefers-color-scheme: dark'),
  'popup.html: includes dark mode CSS media query'
);

// ============================================================
// Test 9: Default target language
// ============================================================
console.log('\n[Test] Default target language');

assert(
  contentJs.match(/^.*let targetLang = 'en';/m),
  'content.js: targetLang defaults to "en"'
);

assert(
  popupJs.includes("result.targetLang || 'en'"),
  'popup.js: fallback targetLang is "en"'
);

// ============================================================
// Test 10: Core translation functions exist
// ============================================================
console.log('\n[Test] Core functions exist');

assert(
  contentJs.includes('function revertAllTranslations()'),
  'content.js: revertAllTranslations exists'
);

assert(
  contentJs.includes('function retranslateAll()'),
  'content.js: retranslateAll exists'
);

assert(
  contentJs.includes('async function translateText('),
  'content.js: translateText exists'
);

assert(
  contentJs.includes('async function translateTweet('),
  'content.js: translateTweet exists'
);

assert(
  contentJs.includes('function observeTwitter()'),
  'content.js: observeTwitter exists'
);

// ============================================================
// Test 11: Required project files exist
// ============================================================
console.log('\n[Test] Required project files exist');

const appDir = path.join(__dirname, '..', 'TwitterTranslator');
const extDir = path.join(__dirname, '..', 'TwitterTranslatorExtension');

assert(
  fs.existsSync(path.join(appDir, 'TwitterTranslatorApp.swift')),
  'TwitterTranslatorApp.swift exists'
);

assert(
  fs.existsSync(path.join(appDir, 'ContentView.swift')),
  'ContentView.swift exists'
);

assert(
  fs.existsSync(path.join(appDir, 'Info.plist')),
  'App Info.plist exists'
);

assert(
  fs.existsSync(path.join(extDir, 'SafariWebExtensionHandler.swift')),
  'SafariWebExtensionHandler.swift exists'
);

assert(
  fs.existsSync(path.join(extDir, 'Info.plist')),
  'Extension Info.plist exists'
);

// Check Extension Info.plist content
const extInfoPlist = fs.readFileSync(path.join(extDir, 'Info.plist'), 'utf8');
assert(
  extInfoPlist.includes('com.apple.Safari.web-extension'),
  'Extension Info.plist: has Safari web-extension point identifier'
);

// ============================================================
// Summary
// ============================================================
console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
