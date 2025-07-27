import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);

export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  author_username?: string;
  author_name?: string;
}

export async function getFollowingUsers(userId: string) {
  try {
    const following = await twitterClient.v2.following(userId, {
      max_results: 100,
      'user.fields': ['username', 'name', 'profile_image_url']
    });
    return following.data || [];
  } catch (error) {
    console.error('Error fetching following users:', error);
    throw error;
  }
}

export async function getUserTweets(userId: string, maxResults: number = 10) {
  try {
    const tweets = await twitterClient.v2.userTimeline(userId, {
      max_results: maxResults,
      'tweet.fields': ['created_at', 'author_id'],
      exclude: ['retweets', 'replies']
    });
    return tweets.data || [];
  } catch (error) {
    console.error('Error fetching user tweets:', error);
    throw error;
  }
}

export async function getSingleTweet(tweetId: string): Promise<Tweet> {
  try {
    const tweet = await twitterClient.v2.singleTweet(tweetId, {
      'tweet.fields': ['created_at', 'author_id'],
      'user.fields': ['username', 'name'],
      expansions: ['author_id']
    });
    
    if (!tweet.data) {
      throw new Error('Tweet not found');
    }
    
    const author = tweet.includes?.users?.[0];
    
    return {
      ...tweet.data,
      author_username: author?.username,
      author_name: author?.name
    };
  } catch (error) {
    console.error('Error fetching single tweet:', error);
    throw error;
  }
}

export async function getFollowingTweets(userId: string, maxTweets: number = 50) {
  try {
    const following = await getFollowingUsers(userId);
    const allTweets: Tweet[] = [];
    
    for (const user of following.slice(0, 10)) {
      const tweets = await getUserTweets(user.id, 5);
      const tweetsWithAuthor = tweets.map(tweet => ({
        ...tweet,
        author_username: user.username,
        author_name: user.name
      }));
      allTweets.push(...tweetsWithAuthor);
    }
    
    return allTweets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, maxTweets);
  } catch (error) {
    console.error('Error fetching following tweets:', error);
    throw error;
  }
}