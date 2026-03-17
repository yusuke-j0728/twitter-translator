/**
 * Tests for Twitter Translator Chrome Extension
 * Tests the core logic functions without requiring a browser environment
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

// Read source files
const contentJs = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const popupJs = fs.readFileSync(path.join(__dirname, '..', 'popup.js'), 'utf8');
const popupHtml = fs.readFileSync(path.join(__dirname, '..', 'popup.html'), 'utf8');

// ============================================================
// Test 1: Default target language is English
// ============================================================
console.log('\n[Test] Default target language should be English');

assert(
  contentJs.match(/^let targetLang = 'en';/m),
  'content.js: targetLang defaults to "en"'
);

assert(
  contentJs.includes("to = 'en'"),
  'content.js: translateText default parameter is "en"'
);

assert(
  popupJs.includes("result.targetLang || 'en'"),
  'popup.js: fallback targetLang is "en"'
);

// Check that English is the first option in the target-lang select
const targetLangSelectMatch = popupHtml.match(/<select id="target-lang">\s*<option value="(\w+)">/);
assert(
  targetLangSelectMatch && targetLangSelectMatch[1] === 'en',
  'popup.html: first option in target-lang select is "en"'
);

// ============================================================
// Test 2: Toggle off reverts translations
// ============================================================
console.log('\n[Test] Toggle off should revert translations');

assert(
  contentJs.includes('function revertAllTranslations()'),
  'content.js: revertAllTranslations function exists'
);

assert(
  contentJs.includes("if (!isEnabled) {\n      revertAllTranslations();"),
  'content.js: disabling calls revertAllTranslations'
);

// Verify revertAllTranslations restores original text
assert(
  contentJs.includes("el.innerText = originalText"),
  'content.js: revertAllTranslations restores original text via innerText'
);

// Verify revertAllTranslations removes data attributes
assert(
  contentJs.includes("el.removeAttribute('data-translated')") &&
  contentJs.includes("el.removeAttribute('data-original-text')") &&
  contentJs.includes("el.removeAttribute('data-translated-text')") &&
  contentJs.includes("el.removeAttribute('data-showing')"),
  'content.js: revertAllTranslations cleans up all data attributes'
);

// Verify revertAllTranslations removes the toggle button
assert(
  contentJs.includes("toggleBtn.remove()"),
  'content.js: revertAllTranslations removes toggle button'
);

// ============================================================
// Test 3: Re-enable retranslates tweets
// ============================================================
console.log('\n[Test] Re-enabling should retranslate tweets');

assert(
  contentJs.includes('function retranslateAll()'),
  'content.js: retranslateAll function exists'
);

assert(
  contentJs.includes("} else {\n      retranslateAll();\n    }"),
  'content.js: enabling calls retranslateAll'
);

// ============================================================
// Test 4: Skip translation for tweets in the target language
// ============================================================
console.log('\n[Test] Skip translation for tweets already in target language');

assert(
  contentJs.includes('function detectTweetLang(element)'),
  'content.js: detectTweetLang function exists'
);

// Check that tweet lang detection uses the lang attribute
assert(
  contentJs.includes("element.hasAttribute('lang')") &&
  contentJs.includes("element.getAttribute('lang')"),
  'content.js: detectTweetLang checks element lang attribute'
);

// Check that it also checks parent elements
assert(
  contentJs.includes("element.closest('[lang]')"),
  'content.js: detectTweetLang checks parent elements for lang'
);

// Check pre-API skip: tweet lang attribute matches target
assert(
  contentJs.includes('tweetLang.startsWith(targetLang)'),
  'content.js: skips translation when tweet lang attribute matches target language'
);

// Check post-API skip: detected language matches target
assert(
  contentJs.includes('detectedLang === targetLang'),
  'content.js: skips translation when API-detected language matches target language'
);

// ============================================================
// Test 5: translateText returns detected language
// ============================================================
console.log('\n[Test] translateText should return detected language');

assert(
  contentJs.includes('return { translatedText, detectedLang }'),
  'content.js: translateText returns object with translatedText and detectedLang'
);

assert(
  contentJs.includes("const detectedLang = data[2] || from"),
  'content.js: detected language extracted from API response data[2]'
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
