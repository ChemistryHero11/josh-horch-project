import newsAgent from '../agents/newsAgent';
import twitterAgent from '../agents/twitterAgent';
import telegramAgent from '../agents/telegramAgent';
import facebookAgent from '../agents/facebookAgent';
import tiktokAgent from '../agents/tiktokAgent';
import aiService from './aiService';
import NewsItem from '../models/NewsItem';
import Alert from '../models/Alert';
import { AlertSeverity } from '../types';
import { EventEmitter } from 'events';

export class MonitoringService extends EventEmitter {
  private isRunning = false;

  async runMonitoringCycle(): Promise<void> {
    if (this.isRunning) {
      console.log('Monitoring cycle already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting monitoring cycle...');

    try {
      const allItems: any[] = [];

      console.log('Fetching from news sources...');
      const newsItems = await newsAgent.fetchNews();
      allItems.push(...newsItems);

      console.log('Fetching from Twitter...');
      const tweets = await twitterAgent.fetchTweets();
      allItems.push(...tweets);

      console.log('Fetching from Telegram...');
      const telegramMessages = await telegramAgent.fetchMessages();
      allItems.push(...telegramMessages);

      console.log('Fetching from Facebook...');
      const facebookPosts = await facebookAgent.fetchPosts();
      allItems.push(...facebookPosts);

      console.log('Fetching from TikTok...');
      const tiktokVideos = await tiktokAgent.fetchVideos();
      allItems.push(...tiktokVideos);

      console.log(`Collected ${allItems.length} items. Processing...`);

      for (const item of allItems) {
        await this.processItem(item);
      }

      console.log('Monitoring cycle completed.');
    } catch (error) {
      console.error('Monitoring cycle error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private async processItem(item: any): Promise<void> {
    try {
      const existingItem = await NewsItem.findOne({
        sourceUrl: item.sourceUrl,
      });

      if (existingItem) {
        return;
      }

      const analysis = await aiService.categorizeContent(
        item.title,
        item.content
      );

      let translatedContent = item.content;
      if (this.isSpanish(item.content)) {
        translatedContent = await aiService.translateToEnglish(item.content);
      }

      const newsItem = new NewsItem({
        title: item.title,
        content: translatedContent,
        summary: analysis.summary,
        category: analysis.category,
        platform: item.platform,
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
        publishedAt: item.publishedAt,
        imageUrl: item.imageUrl,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords,
        entities: analysis.entities,
        isBreaking: analysis.isBreaking,
        severity: analysis.severity,
      });

      await newsItem.save();

      if (analysis.isBreaking || analysis.severity === AlertSeverity.HIGH || analysis.severity === AlertSeverity.CRITICAL) {
        await this.createAlert(newsItem);
      }

      console.log(`Processed: ${item.title.substring(0, 50)}...`);
    } catch (error) {
      console.error('Item processing error:', error);
    }
  }

  private async createAlert(newsItem: any): Promise<void> {
    const alert = new Alert({
      newsItemId: newsItem._id,
      title: newsItem.title,
      message: newsItem.summary,
      severity: newsItem.severity,
      category: newsItem.category,
    });

    await alert.save();

    this.emit('breaking-news', {
      alert,
      newsItem,
    });

    console.log(`🚨 ALERT: ${newsItem.title}`);
  }

  private isSpanish(text: string): boolean {
    const spanishIndicators = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];
    const spanishWords = ['el', 'la', 'los', 'las', 'de', 'en', 'que', 'por', 'para'];
    
    const hasAccents = spanishIndicators.some(char => text.includes(char));
    const hasSpanishWords = spanishWords.some(word => 
      text.toLowerCase().includes(` ${word} `)
    );

    return hasAccents || hasSpanishWords;
  }
}

export default new MonitoringService();
