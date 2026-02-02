import axios from 'axios';
import { config } from '../config';
import { SourcePlatform } from '../types';

export class FacebookAgent {
  private platform = SourcePlatform.FACEBOOK;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  async fetchPosts(): Promise<any[]> {
    const results: any[] = [];

    const pages = [
      'VenezuelaGobierno',
      'VenezuelaNews',
    ];

    for (const pageId of pages) {
      try {
        const response = await axios.get(`${this.baseUrl}/${pageId}/posts`, {
          params: {
            access_token: config.apis.facebook,
            fields: 'message,created_time,permalink_url,full_picture,reactions.summary(true)',
            limit: 50,
          },
        });

        const posts = response.data.data || [];

        for (const post of posts) {
          if (post.message && this.isVenezuelaRelated(post.message)) {
            results.push({
              title: `Facebook: ${pageId}`,
              content: post.message,
              sourceUrl: post.permalink_url,
              sourceName: pageId,
              publishedAt: new Date(post.created_time),
              platform: this.platform,
              imageUrl: post.full_picture,
              metadata: {
                reactions: post.reactions?.summary?.total_count || 0,
              },
            });
          }
        }
      } catch (error) {
        console.error(`Facebook page error for ${pageId}:`, error);
      }
    }

    return results;
  }

  async searchPosts(query: string): Promise<any[]> {
    const results: any[] = [];

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          access_token: config.apis.facebook,
          q: query,
          type: 'post',
          fields: 'message,created_time,permalink_url,from',
          limit: 100,
        },
      });

      const posts = response.data.data || [];

      for (const post of posts) {
        if (post.message) {
          results.push({
            title: `Facebook: ${post.from?.name || 'Unknown'}`,
            content: post.message,
            sourceUrl: post.permalink_url,
            sourceName: post.from?.name || 'Facebook',
            publishedAt: new Date(post.created_time),
            platform: this.platform,
          });
        }
      }
    } catch (error) {
      console.error(`Facebook search error for "${query}":`, error);
    }

    return results;
  }

  private isVenezuelaRelated(text: string): boolean {
    const keywords = config.monitoring.keywords.map(k => k.toLowerCase());
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
  }
}

export default new FacebookAgent();
