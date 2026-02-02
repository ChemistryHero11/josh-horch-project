import axios from 'axios';
import NewsAPI from 'newsapi';
import { config } from '../config';
import { SourcePlatform } from '../types';
import aiService from '../services/aiService';

const newsapi = new NewsAPI(config.apis.newsApi);

export class NewsAgent {
  private platform = SourcePlatform.NEWS;

  async fetchNews(): Promise<any[]> {
    const results: any[] = [];

    try {
      const newsApiResults = await this.fetchFromNewsAPI();
      results.push(...newsApiResults);
    } catch (error) {
      console.error('NewsAPI error:', error);
    }

    try {
      const googleNewsResults = await this.fetchFromGoogleNews();
      results.push(...googleNewsResults);
    } catch (error) {
      console.error('Google News error:', error);
    }

    try {
      const rssResults = await this.fetchFromRSS();
      results.push(...rssResults);
    } catch (error) {
      console.error('RSS feed error:', error);
    }

    return results;
  }

  private async fetchFromNewsAPI(): Promise<any[]> {
    const response = await newsapi.v2.everything({
      q: 'Venezuela OR Maduro OR Caracas',
      language: 'en,es',
      sortBy: 'publishedAt',
      pageSize: 50,
    });

    return (response.articles || []).map((article: any) => ({
      title: article.title,
      content: article.description || article.content || '',
      sourceUrl: article.url,
      sourceName: article.source.name,
      publishedAt: new Date(article.publishedAt),
      imageUrl: article.urlToImage,
      platform: this.platform,
    }));
  }

  private async fetchFromGoogleNews(): Promise<any[]> {
    const results: any[] = [];
    const queries = [
      'Venezuela crisis',
      'Venezuela economy',
      'Venezuela politics',
      'Venezuela Maduro',
      'Venezuela sanctions',
    ];

    for (const query of queries) {
      try {
        const response = await axios.get('https://news.google.com/rss/search', {
          params: {
            q: query,
            hl: 'en-US',
            gl: 'US',
            ceid: 'US:en',
          },
        });

        results.push({
          title: `Google News: ${query}`,
          content: response.data,
          sourceUrl: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
          sourceName: 'Google News',
          publishedAt: new Date(),
          platform: this.platform,
        });
      } catch (error) {
        console.error(`Google News error for query "${query}":`, error);
      }
    }

    return results;
  }

  private async fetchFromRSS(): Promise<any[]> {
    const feeds = [
      'https://www.aljazeera.com/xml/rss/all.xml',
      'https://www.bbc.com/news/world/latin_america/rss.xml',
      'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    ];

    const results: any[] = [];

    for (const feedUrl of feeds) {
      try {
        const response = await axios.get(feedUrl);
        results.push({
          title: `RSS Feed: ${feedUrl}`,
          content: response.data,
          sourceUrl: feedUrl,
          sourceName: 'RSS Feed',
          publishedAt: new Date(),
          platform: this.platform,
        });
      } catch (error) {
        console.error(`RSS feed error for ${feedUrl}:`, error);
      }
    }

    return results;
  }
}

export default new NewsAgent();
