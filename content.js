let targetLang = 'en';
let sourceLang = 'auto';
let isEnabled = true;

chrome.storage.sync.get(['targetLang', 'sourceLang', 'isEnabled'], (result) => {
  if (result.targetLang) targetLang = result.targetLang;
  if (result.sourceLang) sourceLang = result.sourceLang;
  if (result.isEnabled !== undefined) isEnabled = result.isEnabled;
});

function revertAllTranslations() {
  const translatedElements = document.querySelectorAll('[data-translated]');
  translatedElements.forEach(el => {
    const originalText = el.getAttribute('data-original-text');
    if (originalText) {
      const toggleBtn = el.querySelector('.twitter-translator-toggle');
      if (toggleBtn) toggleBtn.remove();
      el.innerText = originalText;
      el.style.paddingRight = '';
      el.style.position = '';
    }
    el.removeAttribute('data-translated');
    el.removeAttribute('data-original-text');
    el.removeAttribute('data-translated-text');
    el.removeAttribute('data-showing');
  });
}

function retranslateAll() {
  const tweets = findTweetElements();
  tweets.forEach(tweet => translateTweet(tweet));
}

chrome.storage.onChanged.addListener((changes) => {
  let langChanged = false;
  if (changes.targetLang) {
    targetLang = changes.targetLang.newValue;
    langChanged = true;
  }
  if (changes.sourceLang) {
    sourceLang = changes.sourceLang.newValue;
    langChanged = true;
  }
  if (changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;
    if (!isEnabled) {
      revertAllTranslations();
    } else {
      retranslateAll();
    }
  } else if (langChanged && isEnabled) {
    revertAllTranslations();
    retranslateAll();
  }
});

function findTweetElements() {
  const selectors = [
    '[data-testid="tweetText"]',
    'div[lang]',
    'article div[dir="auto"]'
  ];
  
  let tweets = [];
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.hasAttribute('data-translated') && el.innerText && el.innerText.trim()) {
        tweets.push(el);
      }
    });
  });
  
  return tweets;
}

async function translateText(text, from = 'auto', to = 'en') {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    if (data && data[0]) {
      const translatedText = data[0].map(item => item[0]).join('');
      const detectedLang = data[2] || from;
      return { translatedText, detectedLang };
    }
  } catch (error) {
    console.error('Translation error:', error);
  }
  return null;
}

function detectTweetLang(element) {
  if (element.hasAttribute('lang')) return element.getAttribute('lang');
  const parent = element.closest('[lang]');
  if (parent) return parent.getAttribute('lang');
  return null;
}

function createToggleButton() {
  const button = document.createElement('button');
  button.className = 'twitter-translator-toggle';
  button.innerHTML = '🌐';
  button.title = 'オリジナル/翻訳を切り替え';
  return button;
}

async function translateTweet(element) {
  if (!isEnabled || element.hasAttribute('data-translated')) return;

  const tweetLang = detectTweetLang(element);
  if (tweetLang && tweetLang.startsWith(targetLang)) return;

  element.setAttribute('data-translated', 'true');

  const originalText = element.innerText;
  const result = await translateText(originalText, sourceLang, targetLang);

  if (!result) {
    element.removeAttribute('data-translated');
    return;
  }

  const { translatedText, detectedLang } = result;

  if (detectedLang === targetLang) {
    element.removeAttribute('data-translated');
    return;
  }

  if (translatedText && translatedText !== originalText) {
    // Store original text
    element.setAttribute('data-original-text', originalText);
    element.setAttribute('data-translated-text', translatedText);
    element.setAttribute('data-showing', 'translated');
    
    // Replace text with translation
    element.innerText = translatedText;
    
    // Add padding to prevent text overlap
    element.style.position = 'relative';
    element.style.paddingRight = '35px';
    
    // Add toggle button
    const toggleButton = createToggleButton();
    element.appendChild(toggleButton);
    
    toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const currentlyShowing = element.getAttribute('data-showing');
      if (currentlyShowing === 'translated') {
        element.childNodes[0].textContent = element.getAttribute('data-original-text');
        element.setAttribute('data-showing', 'original');
        toggleButton.style.opacity = '0.5';
      } else {
        element.childNodes[0].textContent = element.getAttribute('data-translated-text');
        element.setAttribute('data-showing', 'translated');
        toggleButton.style.opacity = '1';
      }
    });
  } else {
    element.removeAttribute('data-translated');
  }
}

function observeTwitter() {
  const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;
    
    setTimeout(() => {
      const tweets = findTweetElements();
      tweets.forEach(tweet => translateTweet(tweet));
    }, 500);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  const initialTweets = findTweetElements();
  initialTweets.forEach(tweet => translateTweet(tweet));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeTwitter);
} else {
  observeTwitter();
}

document.addEventListener('contextmenu', (e) => {
  const tweetElement = e.target.closest('[data-testid="tweetText"], div[lang], article div[dir="auto"]');
  if (tweetElement && !tweetElement.hasAttribute('data-translated')) {
    chrome.runtime.sendMessage({
      action: 'createContextMenu',
      text: tweetElement.innerText
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateSelection') {
    const tweetElement = document.querySelector(`[data-testid="tweetText"]:hover, div[lang]:hover, article div[dir="auto"]:hover`);
    if (tweetElement) {
      translateTweet(tweetElement);
    }
  }
});