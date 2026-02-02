import { Telegraf } from 'telegraf';
import { config } from '../config';
import { SourcePlatform } from '../types';

export class TelegramAgent {
  private bot: Telegraf;
  private platform = SourcePlatform.TELEGRAM;
  private monitoredChannels: string[] = [
    '@VenezuelaNews',
    '@VenezuelaCrisis',
    '@MaduroVenezuela',
    '@actualidadvenezuela',
    '@VenezuelaLibre',
    '@NoticiasVenezuela',
    '@VenezuelaAlDia',
    '@InfoVenezuela',
    '@VenezuelaReal',
    '@CaracasChronicle',
    '@VenezuelaPolitica',
    '@VenezuelaEconomia',
    '@AlertaVenezuela',
  ];

  constructor() {
    this.bot = new Telegraf(config.apis.telegram);
  }

  async fetchMessages(): Promise<any[]> {
    const results: any[] = [];

    for (const channel of this.monitoredChannels) {
      try {
        const updates = await this.bot.telegram.getUpdates(0, 100, 0, undefined);

        for (const update of updates) {
          if ('channel_post' in update && update.channel_post) {
            const post: any = update.channel_post;
            
            if (post.text && this.isVenezuelaRelated(post.text)) {
              results.push({
                title: `Telegram: ${channel}`,
                content: post.text,
                sourceUrl: `https://t.me/${channel.replace('@', '')}/${post.message_id}`,
                sourceName: channel,
                publishedAt: new Date(post.date * 1000),
                platform: this.platform,
                imageUrl: post.photo?.[0]?.file_id,
              });
            }
          }
        }
      } catch (error) {
        console.error(`Telegram channel error for ${channel}:`, error);
      }
    }

    return results;
  }

  private isVenezuelaRelated(text: string): boolean {
    const keywords = config.monitoring.keywords.map(k => k.toLowerCase());
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
  }

  async monitorChannels(channels: string[]): Promise<any[]> {
    this.monitoredChannels = channels;
    return this.fetchMessages();
  }
}

export default new TelegramAgent();
