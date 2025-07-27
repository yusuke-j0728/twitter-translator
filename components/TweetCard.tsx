import React from 'react';
import { Tweet } from '../lib/twitter';
import { TranslationResult } from '../lib/translator';

interface TweetCardProps {
  tweet: Tweet & { translation: TranslationResult };
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isTranslated = tweet.translation.originalText !== tweet.translation.translatedText;

  return (
    <div className="tweet-card">
      <div className="tweet-header">
        <div className="author-info">
          <span className="author-name">{tweet.author_name}</span>
          <span className="author-username">@{tweet.author_username}</span>
        </div>
        <span className="tweet-date">{formatDate(tweet.created_at)}</span>
      </div>
      
      <div className="tweet-content">
        {isTranslated && (
          <div className="original-text">
            <strong>Original:</strong>
            <p>{tweet.text}</p>
          </div>
        )}
        
        <div className="translated-text">
          <strong>{isTranslated ? 'Translation:' : 'Text:'}</strong>
          <p>{tweet.translation.translatedText}</p>
        </div>
        
        {isTranslated && tweet.translation.detectedLanguage && (
          <div className="language-info">
            <small>Detected language: {tweet.translation.detectedLanguage}</small>
          </div>
        )}
      </div>
    </div>
  );
}