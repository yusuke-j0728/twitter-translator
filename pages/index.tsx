import React, { useState, useEffect } from 'react';
import TweetCard from '../components/TweetCard';
import { Tweet } from '../lib/twitter';
import { TranslationResult } from '../lib/translator';

interface TranslatedTweet extends Tweet {
  translation: TranslationResult;
}

export default function Home() {
  const [tweets, setTweets] = useState<TranslatedTweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [tweetUrl, setTweetUrl] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'url'>('user');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  // Handle URL parameters for sharing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url') || urlParams.get('text');
    
    if (sharedUrl) {
      // Check if it's a tweet URL
      if (sharedUrl.includes('/status/')) {
        setTweetUrl(sharedUrl);
        setActiveTab('url');
      } else if (sharedUrl.includes('twitter.com/') || sharedUrl.includes('x.com/')) {
        // It's a user profile URL
        setUserId(sharedUrl);
        setActiveTab('user');
      }
    }
  }, []);
  
  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const parseTweetUrl = (url: string): string | null => {
    const patterns = [
      /twitter\.com\/\w+\/status\/(\d+)/,
      /x\.com\/\w+\/status\/(\d+)/,
      /twitter\.com\/i\/web\/status\/(\d+)/,
      /x\.com\/i\/web\/status\/(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const parseUserUrl = (url: string): string | null => {
    const patterns = [
      /twitter\.com\/(\w+)/,
      /x\.com\/(\w+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && !match[0].includes('/status/')) return match[1];
    }
    return null;
  };

  const fetchTweets = async () => {
    if (activeTab === 'user' && !userId.trim()) {
      setError('Please enter a Twitter User ID or profile URL');
      return;
    }
    
    if (activeTab === 'url' && !tweetUrl.trim()) {
      setError('Please enter a Tweet URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (activeTab === 'user') {
        // Check if it's a URL or username
        const extractedUserId = parseUserUrl(userId) || userId;
        response = await fetch(`/api/tweets?userId=${encodeURIComponent(extractedUserId)}&maxTweets=20`);
      } else {
        const tweetId = parseTweetUrl(tweetUrl);
        if (!tweetId) {
          setError('Invalid Tweet URL format');
          setLoading(false);
          return;
        }
        response = await fetch(`/api/tweets?tweetId=${tweetId}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTweets(data.tweets);
      } else {
        setError(data.message || 'Failed to fetch tweets');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Twitter Translator</h1>
        <p>Translate tweets from users you follow into English</p>
        <details className="help-section">
          <summary>Quick Access Tools</summary>
          <div className="help-content">
            <h3>Bookmarklet</h3>
            <p>Drag this button to your bookmarks bar:</p>
            <a 
              href={`javascript:(function(){window.open('${typeof window !== 'undefined' ? window.location.origin : ''}/?url='+encodeURIComponent(window.location.href),'_blank');})()`}
              className="bookmarklet"
              onClick={(e) => {
                e.preventDefault();
                alert('Drag this button to your bookmarks bar!');
              }}
            >
              Translate Tweet
            </a>
            <p className="help-text">Use this bookmarklet while on Twitter/X to quickly translate tweets</p>
          </div>
        </details>
      </header>

      <div className="input-section">
        <div className="input-tabs">
          <button
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            User Timeline
          </button>
          <button
            className={`tab-button ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            Single Tweet
          </button>
        </div>
        
        <div className="input-group">
          {activeTab === 'user' ? (
            <input
              type="text"
              placeholder="Enter Twitter username or profile URL"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="user-input"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter Tweet URL (e.g., https://x.com/user/status/123...)"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              className="url-input"
            />
          )}
          <button 
            onClick={fetchTweets}
            disabled={loading}
            className="fetch-button"
          >
            {loading ? 'Loading...' : 'Translate'}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="tweets-container">
        {tweets.length > 0 && (
          <div className="tweets-list">
            {tweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
      
      {showInstallPrompt && (
        <div className="install-prompt">
          <div className="install-prompt-text">
            <p>Install Twitter Translator</p>
            <small>Add to your home screen for quick access</small>
          </div>
          <button className="install-button" onClick={handleInstallClick}>
            Install
          </button>
          <button className="close-button" onClick={() => setShowInstallPrompt(false)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}