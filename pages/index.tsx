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
  const [error, setError] = useState('');

  const fetchTweets = async () => {
    if (!userId.trim()) {
      setError('Please enter a Twitter User ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/tweets?userId=${encodeURIComponent(userId)}&maxTweets=20`);
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
      </header>

      <div className="input-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your Twitter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="user-input"
          />
          <button 
            onClick={fetchTweets}
            disabled={loading}
            className="fetch-button"
          >
            {loading ? 'Loading...' : 'Fetch & Translate Tweets'}
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
    </div>
  );
}