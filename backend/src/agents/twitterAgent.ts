import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config';
import { SourcePlatform } from '../types';

export class TwitterAgent {
  private client: TwitterApi;
  private platform = SourcePlatform.TWITTER;

  constructor() {
    this.client = new TwitterApi(config.apis.twitter);
  }

  async fetchTweets(): Promise<any[]> {
    const results: any[] = [];

    const queries = [
      'Venezuela',
      'Maduro',
      'Caracas',
      '#Venezuela',
      'Venezuela crisis',
      'Venezuela economy',
    ];

    for (const query of queries) {
      try {
        const tweets = await this.client.v2.search(query, {
          max_results: 100,
          'tweet.fields': ['created_at', 'public_metrics', 'entities', 'attachments'],
          'user.fields': ['username', 'verified'],
          expansions: ['author_id', 'attachments.media_keys'],
          'media.fields': ['url', 'preview_image_url'],
        });

        for await (const tweet of tweets) {
          results.push({
            title: `Tweet by @${tweet.author_id}`,
            content: tweet.text,
            sourceUrl: `https://twitter.com/i/web/status/${tweet.id}`,
            sourceName: 'Twitter',
            publishedAt: new Date(tweet.created_at || Date.now()),
            platform: this.platform,
            metadata: {
              likes: tweet.public_metrics?.like_count || 0,
              retweets: tweet.public_metrics?.retweet_count || 0,
              replies: tweet.public_metrics?.reply_count || 0,
            },
          });
        }
      } catch (error) {
        console.error(`Twitter search error for "${query}":`, error);
      }
    }

    return results;
  }

  async monitorAccounts(accounts: string[]): Promise<any[]> {
    const results: any[] = [];

    const defaultAccounts = [
      'NicolasMaduro',
      'jguaido',
      'VenezuelaGob',
      'AlbertoRavell',
      'vladimirpadrino',
    ];

    const accountsToMonitor = accounts.length > 0 ? accounts : defaultAccounts;

    for (const username of accountsToMonitor) {
      try {
        const user = await this.client.v2.userByUsername(username);
        if (!user.data) continue;

        const tweets = await this.client.v2.userTimeline(user.data.id, {
          max_results: 20,
          'tweet.fields': ['created_at', 'public_metrics'],
        });

        for await (const tweet of tweets) {
          results.push({
            title: `Tweet by @${username}`,
            content: tweet.text,
            sourceUrl: `https://twitter.com/${username}/status/${tweet.id}`,
            sourceName: `Twitter - @${username}`,
            publishedAt: new Date(tweet.created_at || Date.now()),
            platform: this.platform,
          });
        }
      } catch (error) {
        console.error(`Twitter account monitoring error for @${username}:`, error);
      }
    }

    return results;
  }
}

export default new TwitterAgent();
