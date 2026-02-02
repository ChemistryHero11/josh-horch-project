import axios from 'axios';
import { config } from '../config';
import { SourcePlatform } from '../types';

export class TikTokAgent {
  private platform = SourcePlatform.TIKTOK;
  private baseUrl = 'https://open.tiktokapis.com/v2';

  async fetchVideos(): Promise<any[]> {
    const results: any[] = [];

    const hashtags = [
      'venezuela',
      'venezuelacrisis',
      'maduro',
      'caracas',
      'venezuelanews',
    ];

    for (const hashtag of hashtags) {
      try {
        const response = await axios.post(
          `${this.baseUrl}/research/video/query/`,
          {
            query: {
              and: [
                { field_name: 'hashtag_name', field_values: [hashtag] },
              ],
            },
            max_count: 100,
          },
          {
            headers: {
              'Authorization': `Bearer ${config.apis.tiktok}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const videos = response.data.data?.videos || [];

        for (const video of videos) {
          results.push({
            title: `TikTok: #${hashtag}`,
            content: video.video_description || '',
            sourceUrl: `https://www.tiktok.com/@${video.username}/video/${video.id}`,
            sourceName: `TikTok - @${video.username}`,
            publishedAt: new Date(video.create_time * 1000),
            platform: this.platform,
            imageUrl: video.cover_image_url,
            metadata: {
              views: video.view_count || 0,
              likes: video.like_count || 0,
              shares: video.share_count || 0,
            },
          });
        }
      } catch (error) {
        console.error(`TikTok hashtag error for #${hashtag}:`, error);
      }
    }

    return results;
  }

  async searchVideos(keyword: string): Promise<any[]> {
    const results: any[] = [];

    try {
      const response = await axios.post(
        `${this.baseUrl}/research/video/query/`,
        {
          query: {
            and: [
              { field_name: 'keyword', field_values: [keyword] },
            ],
          },
          max_count: 100,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apis.tiktok}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const videos = response.data.data?.videos || [];

      for (const video of videos) {
        results.push({
          title: `TikTok: ${keyword}`,
          content: video.video_description || '',
          sourceUrl: `https://www.tiktok.com/@${video.username}/video/${video.id}`,
          sourceName: `TikTok - @${video.username}`,
          publishedAt: new Date(video.create_time * 1000),
          platform: this.platform,
          imageUrl: video.cover_image_url,
        });
      }
    } catch (error) {
      console.error(`TikTok search error for "${keyword}":`, error);
    }

    return results;
  }
}

export default new TikTokAgent();
