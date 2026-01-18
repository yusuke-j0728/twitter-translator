import { NextApiRequest, NextApiResponse } from 'next';
import { getFollowingTweets } from '../../lib/twitter';
import { translateMultiple } from '../../lib/translator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, maxTweets = 20 } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const tweets = await getFollowingTweets(userId, Number(maxTweets));
    
    const textsToTranslate = tweets.map(tweet => tweet.text);
    const translations = await translateMultiple(textsToTranslate);
    
    const translatedTweets = tweets.map((tweet, index) => ({
      ...tweet,
      translation: translations[index]
    }));

    res.status(200).json({
      success: true,
      tweets: translatedTweets
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch and translate tweets'
    });
  }
}